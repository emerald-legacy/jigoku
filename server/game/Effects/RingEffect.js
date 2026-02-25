const Effect = require('./Effect.js');

class RingEffect extends Effect {
    getTargets() {
        return Object.values(this.game.rings).filter(ring => this.match(ring, this.context));
    }
}

module.exports = RingEffect;
