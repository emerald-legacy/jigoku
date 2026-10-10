import { ThenAbility } from '../../../build/server/game/ThenAbility.js';
import { attach, cardLastingEffect } from '../../../build/server/game/GameActions/GameActions.js';
import { changeType } from '../../../build/server/game/effects.js';
import { CardType, Duration } from '../../../build/server/game/Constants.js';

describe('a character becoming an attachment', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'brash-samurai', 'doji-challenger']
                },
                player2: {
                    inPlay: ['kakita-asami']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.challenger = this.player1.findCardByName('doji-challenger');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer, this.brash],
                defenders: []
            });

            this.resolve = (action, target) => {
                const context = new ThenAbility(this.whisperer, {}).createContext(this.player1.player);
                this.game.queueSimpleStep(() => action.resolve(target, context));
                this.game.continue();
            };
            // as the cards do: it becomes an attachment, then is attached
            this.resolve(cardLastingEffect({
                canChangeZoneOnce: true,
                duration: Duration.Custom,
                effect: changeType(CardType.Attachment)
            }), this.whisperer);
        });

        it('leaves the conflict and the cards in play when attached to a character', function() {
            this.resolve(attach({ attachment: this.whisperer }), this.brash);

            expect(this.brash.attachments).toContain(this.whisperer);
            expect(this.whisperer.isParticipating()).toBe(false);
            expect(this.game.currentConflict.attackers).not.toContain(this.whisperer);
            expect(this.player1.player.cardsInPlay).not.toContain(this.whisperer);
            expect(this.player1.player.cardsInPlay).toContain(this.brash);
            expect(this.player1.player.cardsInPlay).toContain(this.challenger);
        });
    });
});
