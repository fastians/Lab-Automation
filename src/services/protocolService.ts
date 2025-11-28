import type { ProtocolRun, ProtocolTemplate, PipetteOperation, Device } from "../types";

export class ProtocolService {
  /**
   * Creates a new protocol run from a template
   */
  static createRun(
    template: ProtocolTemplate,
    device: Device,
    initiatedBy: string = "System"
  ): ProtocolRun {
    return {
      id: Date.now().toString(),
      templateId: template.id,
      templateName: template.name,
      deviceId: device.id,
      deviceName: device.name,
      status: "queued",
      progress: 0,
      currentStep: 0,
      totalSteps: template.steps.length,
      startedAt: null,
      completedAt: null,
      steps: [...template.steps],
      initiatedBy,
    };
  }

  /**
   * Starts a protocol run
   */
  static startRun(run: ProtocolRun): ProtocolRun {
    return {
      ...run,
      status: "running",
      startedAt: new Date().toISOString(),
    };
  }

  /**
   * Executes a single step of a protocol run
   */
  static executeStep(
    run: ProtocolRun,
    stepIndex: number,
    moduleId?: string,
    moduleName?: string,
    initiatedBy: string = "System"
  ): {
    operation: PipetteOperation;
    updatedRun: ProtocolRun;
  } {
    const step = run.steps[stepIndex];
    if (!step) {
      throw new Error(`Step ${stepIndex} not found in protocol run ${run.id}`);
    }

    // Create operation
    const operation: PipetteOperation = {
      id: `${run.id}-step-${stepIndex}-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      deviceId: run.deviceId,
      deviceName: run.deviceName,
      moduleId,
      moduleName,
      source: step.source,
      destination: step.destination,
      volume: step.volume,
      status: "in_progress",
      protocolRunId: run.id,
      initiatedBy,
    };

    // Update run progress
    const newStep = stepIndex + 1;
    const progress = Math.round((newStep / run.totalSteps) * 100);
    const isComplete = newStep >= run.totalSteps;

    const updatedRun: ProtocolRun = isComplete
      ? {
          ...run,
          status: "completed",
          progress: 100,
          currentStep: run.totalSteps,
          completedAt: new Date().toISOString(),
        }
      : {
          ...run,
          progress,
          currentStep: newStep,
        };

    return { operation, updatedRun };
  }

  /**
   * Completes an operation
   */
  static completeOperation(operation: PipetteOperation): PipetteOperation {
    return {
      ...operation,
      status: "completed",
    };
  }

  /**
   * Fails an operation
   */
  static failOperation(operation: PipetteOperation): PipetteOperation {
    return {
      ...operation,
      status: "failed",
    };
  }

  /**
   * Pauses a protocol run
   */
  static pauseRun(run: ProtocolRun): ProtocolRun {
    return {
      ...run,
      status: "paused",
    };
  }

  /**
   * Resumes a protocol run
   */
  static resumeRun(run: ProtocolRun): ProtocolRun {
    return {
      ...run,
      status: "running",
    };
  }
}

