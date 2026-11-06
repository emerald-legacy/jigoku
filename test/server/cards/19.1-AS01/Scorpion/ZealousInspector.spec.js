describe('Zealous Inspector', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['zealous-inspector', 'yogo-paramour'],
                    hand: ['way-of-the-scorpion', 'ornate-fan']
                },
                player2: {
                    inPlay: ['doji-challenger'],
                    hand: ['spies-at-court', 'calling-in-favors']
                }
            });

            this.inspector = this.player1.findCardByName('zealous-inspector');
            this.paramour = this.player1.findCardByName('yogo-paramour');
            this.ornateFan = this.player1.findCardByName('ornate-fan');
            this.wayOfTheScorpion = this.player1.findCardByName(
                'way-of-the-scorpion'
            );

            this.challenger = this.player2.findCardByName('doji-challenger');
            this.spies = this.player2.findCardByName('spies-at-court');
            this.cif = this.player2.findCardByName('calling-in-favors');

            // this.game.checkGameState(true);
        });

        it('triggers outside conflicts', function () {
            this.player1.clickCard(this.paramour);
            this.player1.clickCard(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.inspector);

            this.player1.clickCard(this.inspector);
            expect(this.player1).toHavePrompt('Initiate an action');
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Zealous Inspector to gain an additional action — time to deliver swift punishment for the wicked'
            );
        });

        it('triggers during conflicts', function () {
            this.noMoreActions();
            this.initiateConflict({
                ring: 'fire',
                type: 'military',
                attackers: [this.paramour, this.inspector],
                defenders: [this.challenger]
            });

            this.player2.pass();

            this.player1.clickCard(this.paramour);
            this.player1.clickCard(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.inspector);

            this.player1.clickCard(this.inspector);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.player2).toHavePrompt(
                'Waiting for opponent to take an action or pass'
            );

            expect(this.getChatLogs(5)).toContain(
                'player1 uses Zealous Inspector to gain an additional action — time to deliver swift punishment for the wicked'
            );
        });

        it('Does not trigger during conflict resolutions due to ring effects', function () {
            this.player1.clickCard(this.ornateFan);
            this.player1.clickCard(this.inspector);

            this.noMoreActions();
            this.initiateConflict({
                ring: 'fire',
                type: 'political',
                attackers: [this.inspector],
                defenders: [this.challenger]
            });
            this.noMoreActions();

            this.player1.clickCard(this.challenger);
            this.player1.clickPrompt('Dishonor Doji Challenger');

            expect(this.player1).not.toBeAbleToSelect(this.inspector);
        });
    });
});

describe('Zealous Inspector in the dynasty phase', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    inPlay: ['zealous-inspector'],
                    dynastyDiscard: ['beguiling-maiko', 'doji-whisperer']
                },
                player2: {
                    inPlay: ['asahina-artisan'],
                    dynastyDiscard: ['doji-challenger']
                }
            });
            this.inspector = this.player1.findCardByName('zealous-inspector');
            this.maiko = this.player1.placeCardInProvince('beguiling-maiko', 'province 1');
            this.whisperer = this.player1.placeCardInProvince('doji-whisperer', 'province 2');
            this.challenger = this.player2.placeCardInProvince('doji-challenger', 'province 1');
            this.artisan = this.player2.findCardByName('asahina-artisan');
            this.player2.player.imperialFavor = 'political';
        });

        it('takes another action also after the first action of the phase', function () {
            this.player1.clickCard(this.whisperer);
            this.player1.clickPrompt('0');
            this.player2.clickCard(this.challenger);
            this.player2.clickPrompt('0');

            this.player1.clickCard(this.maiko);
            this.player1.clickPrompt('0');
            this.player1.clickCard(this.maiko);
            this.player2.clickCard(this.artisan);
            expect(this.artisan.isDishonored).toBe(true);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.inspector);

            expect(this.player1).toHavePrompt('Play cards from provinces');
            expect(this.player2).not.toHavePrompt('Play cards from provinces');
        });
    });
});
