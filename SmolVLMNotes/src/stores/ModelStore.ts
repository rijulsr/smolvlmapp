import { makeAutoObservable } from 'mobx';
import { ModelState, ModelResult } from '../models/types';

class ModelStore {
  state: ModelState = {
    isLoaded: false,
    isProcessing: false,
    currentModel: null,
    results: [],
    error: null,
  };

  constructor() {
    makeAutoObservable(this);
  }

  setModel(model: string) {
    this.state.currentModel = model;
    this.state.isLoaded = true;
    this.state.error = null;
  }

  setProcessing(isProcessing: boolean) {
    this.state.isProcessing = isProcessing;
  }

  addResult(result: ModelResult) {
    this.state.results.push(result);
  }

  setError(error: string) {
    this.state.error = error;
  }

  clearResults() {
    this.state.results = [];
  }
}

export const modelStore = new ModelStore(); 