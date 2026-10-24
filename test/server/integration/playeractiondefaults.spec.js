import { ResolvableAbility } from '../../../build/server/game/ResolvableAbility.js';
import { claimImperialFavor, setHonorDial, takeHonor } from '../../../build/server/game/GameActions/GameActions.js';

describe('Player action default targets', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer']
                },
                player2: {
                    inPlay: ['adept-of-the-waves']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.resolve = (action) => {
                const context = new ResolvableAbility(this.whisperer, {}).createContext(this.player1.player);
                this.game.queueSimpleStep(() => action.resolve(undefined, context));
                this.game.continue();
            };
        });

        it('affect the ability\'s player by default', function () {
            this.resolve(setHonorDial({ value: 4 }));
            expect(this.player1.player.showBid).toBe(4);

            this.resolve(claimImperialFavor({ side: 'military' }));
            expect(this.player1.player.imperialFavor).toBe('military');
            expect(this.player2.player.imperialFavor).toBe('');
        });

        it('target the opponent for actions aimed at them', function () {
            const honor1 = this.player1.honor;
            const honor2 = this.player2.honor;
            this.resolve(takeHonor());
            expect(this.player1.honor).toBe(honor1 + 1);
            expect(this.player2.honor).toBe(honor2 - 1);
        });
    });
});
