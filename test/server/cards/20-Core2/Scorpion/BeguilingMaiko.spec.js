import { ResolvableAbility } from '../../../../../build/server/game/ResolvableAbility.js';
import { putIntoPlay } from '../../../../../build/server/game/GameActions/GameActions.js';

describe('Beguiling Maiko', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    dynastyDiscard: ['beguiling-maiko']
                },
                player2: {
                    hand: ['assassination', 'fine-katana'],
                    inPlay: ['asahina-artisan']
                }
            });

            this.maiko = this.player1.placeCardInProvince('beguiling-maiko', 'province 1');
            this.asahinaArtisan = this.player2.findCardByName('asahina-artisan');
        });

        it('should be allowed to trigger as soon as the character enters play', function () {
            this.player1.clickCard(this.maiko);
            this.player1.clickPrompt('1');

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.maiko);
        });

        it('claims the favor when it is unclaimed', function () {
            this.player1.clickCard(this.maiko);
            this.player1.clickPrompt('1');
            this.player1.clickCard(this.maiko);
            this.player1.clickPrompt('military');
            expect(this.player1.player.imperialFavor).toBe('military');
            expect(this.getChatLogs(5)).toContain('player1 claims the Emperor\'s military favor!');
            expect(this.getChatLogs(5)).toContain('player1 uses Beguiling Maiko to claim the Emperor\'s favor');
        });

        it('looks at opponent hand when favor is military', function () {
            this.player2.player.imperialFavor = 'military';

            this.player1.clickCard(this.maiko);
            this.player1.clickPrompt('1');
            this.player1.clickCard(this.maiko);
            expect(this.getChatLogs(5)).toContain('Beguiling Maiko sees Assassination and Fine Katana');
        });

        it('forces opponent to dishonor someone when favor is political', function () {
            this.player2.player.imperialFavor = 'political';

            this.player1.clickCard(this.maiko);
            this.player1.clickPrompt('1');
            this.player1.clickCard(this.maiko);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Beguiling Maiko to force player2 to dishonor one of their characters'
            );

            expect(this.player2).toHavePrompt('Choose a character');
            this.player2.clickCard(this.asahinaArtisan);
            expect(this.asahinaArtisan.isDishonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player2 dishonors Asahina Artisan');
        });
    });
});

describe('Beguiling Maiko put into play', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer'],
                    dynastyDiscard: ['beguiling-maiko']
                }
            });
            this.maiko = this.player1.findCardByName('beguiling-maiko');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
        });

        it('does not react when put into play', function () {
            const context = new ResolvableAbility(this.whisperer, {}).createContext(this.player1.player);
            this.game.queueSimpleStep(() => putIntoPlay().resolve(this.maiko, context));
            this.game.continue();
            expect(this.maiko.location).toBe('play area');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });
    });
});
