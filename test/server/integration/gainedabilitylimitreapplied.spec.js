import { ResolvableAbility } from '../../../build/server/game/ResolvableAbility.js';
import { attach } from '../../../build/server/game/GameActions/GameActions.js';

describe('a gained ability with its own limit, gained again by the same character', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-manipulator', 'bayushi-liar'],
                    hand: ['sturdy-tetsubo']
                }
            });
            this.manipulator = this.player1.findCardByName('bayushi-manipulator');
            this.liar = this.player1.findCardByName('bayushi-liar');
            this.tetsubo = this.player1.findCardByName('sturdy-tetsubo');
            this.player1.playAttachment(this.tetsubo, this.manipulator);

            const context = new ResolvableAbility(this.liar, {}).createContext(this.player1.player);
            this.move = (target) => {
                this.game.queueSimpleStep(() => attach({ attachment: this.tetsubo }).resolve(target, context));
                this.game.continue();
            };
            this.gainedLimit = () => this.manipulator.getReactions().find((reaction) => reaction.title === 'Make opponent discard 1 card').limit;
        });

        it('still resets its uses at the end of the round', function() {
            this.move(this.liar);
            this.move(this.manipulator);
            expect(this.tetsubo.parent).toBe(this.manipulator);

            const limit = this.gainedLimit();
            limit.increment(this.player1.player);
            limit.increment(this.player1.player);
            expect(limit.isAtMax(this.player1.player)).toBe(true);

            this.game.emitEvent('onRoundEnded');
            expect(this.gainedLimit().isAtMax(this.player1.player)).toBe(false);
        });
    });
});
