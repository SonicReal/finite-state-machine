class FSM {


    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) {
            throw new Error();
        }
        this._config = config;
        this._states = config.states;
        for (let i in this._states) {
            this._states[i].name = i;
        }
        this._current = config.initial;
        this._history = [];
        this._cursor = 0;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this._current;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this._states[state]) {
            this._changeState(state);
            this._history.length = this._cursor + 1;
            this._history.push(this.getState());
            this._cursor = this._history.length - 1;
        } else {
            throw new Error();
        }
    }


    _changeState(state) {
        this._current = state;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        const state = this._states[this._current];
        if (state && state.transitions && state.transitions[event]) {
            this.changeState(state.transitions[event])
        } else {
            throw new Error()
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this._current = this._config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (!event) {
            return Object.keys(this._states);
        }
        const states = []
        for (let i in this._states) {
            if (this._states[i].transitions[event]) {
                states.push(i);
            }
        }
        return states;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this._cursor - 1 < 0) {
            return false;
        } else {
            this._cursor--;
            this._changeState(this._history[this._cursor] === undefined
                ? this._config.initial
                : this._history[this._cursor]);
            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this._cursor + 1 > this._history.length - 1) {
            return false;
        } else {
            this._cursor++;
            this._changeState(this._history[this._cursor] === undefined
                ? this._config.initial
                : this._history[this._cursor]);
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._cursor = 0;
        this._history = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
