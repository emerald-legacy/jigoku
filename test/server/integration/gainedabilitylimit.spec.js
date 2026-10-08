import { GainAbility } from '../../../build/server/game/Effects/GainAbility.js';
import { AbilityType } from '../../../build/server/game/Constants.js';

describe('a gained ability applied again', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.roundEndListeners = () => this.game.events.bus.handlers.get('onRoundEnded')?.size ?? 0;
        });

        it('keeps one limit listening, not one per application', function() {
            const gain = new GainAbility(AbilityType.Action, { title: 'Gained action' });
            gain.setContext(this.game.getFrameworkContext(this.player1.player));
            const before = this.roundEndListeners();

            gain.apply(this.whisperer);
            gain.unapply(this.whisperer);
            gain.apply(this.whisperer);
            gain.unapply(this.whisperer);
            gain.apply(this.whisperer);

            expect(this.roundEndListeners()).toBe(before + 1);
        });
    });
});
