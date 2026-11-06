import { Duel } from '../../../build/server/game/Duel.js';
import { DuelType } from '../../../build/server/game/Constants.js';

describe('duel listeners', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['prudent-challenger']
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    hand: ['fine-katana']
                }
            });
            this.prudentChallenger = this.player1.findCardByName('prudent-challenger');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.listening = new Set();
            const on = this.game.on.bind(this.game);
            const off = this.game.off.bind(this.game);
            spyOn(this.game, 'on').and.callFake((name, handler) => {
                if(name === 'onCardAbilityTriggered') {
                    this.listening.add(handler);
                }
                on(name, handler);
            });
            spyOn(this.game, 'off').and.callFake((name, handler) => {
                this.listening.delete(handler);
                off(name, handler);
            });
        });

        it('listens only while the duel runs', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.prudentChallenger],
                defenders: [this.whisperer]
            });
            this.player2.playAttachment('fine-katana', this.whisperer);
            this.player1.clickCard(this.prudentChallenger);
            this.player1.clickCard(this.whisperer);
            expect(this.listening.size).toBe(1);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.game.currentDuel).toBeNull();
            expect(this.listening.size).toBe(0);
        });

        it('does not listen for a duel that never starts', function() {
            new Duel(this.game, this.prudentChallenger, [this.whisperer], DuelType.Military, {});
            expect(this.listening.size).toBe(0);
        });
    });
});
