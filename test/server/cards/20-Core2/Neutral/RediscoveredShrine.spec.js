describe('Rediscovered Shrine', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    inPlay: [{ card: 'doji-whisperer', honor: 'honored', attachments: ['ornate-fan'] }],
                    hand: ['perfect-land-ethos', 'written-in-the-stars', 'let-go', 'ancestral-daisho'],
                    dynastyDeck: ['rediscovered-shrine']
                },
                player2: {
                    fate: 10,
                    hand: ['perfect-land-ethos']
                }
            });
            this.shrine = this.player1.placeCardInProvince('rediscovered-shrine', 'province 1');
            this.province = this.player1.provinces['province 1'].provinceCard;
            this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
            this.ethos = this.player1.findCardByName('perfect-land-ethos');
            this.writtenInTheStars = this.player1.findCardByName('written-in-the-stars');
            this.letGo = this.player1.findCardByName('let-go');
            this.daisho = this.player1.findCardByName('ancestral-daisho');
            this.opponentEthos = this.player2.findCardByName('perfect-land-ethos');
        });

        it('should reduce the cost of an event you play by 1', function () {
            this.player1.clickCard(this.ethos);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.shrine);
            this.player1.clickCard(this.shrine);
            expect(this.player1.fate).toBe(9);
            expect(this.dojiWhisperer.isHonored).toBe(false);
            expect(this.ethos.location).toBe('conflict discard pile');
        });

        it('should reduce the cost of a 1-cost event to 0', function () {
            this.player1.clickCard(this.writtenInTheStars);
            this.player1.clickPrompt('Place one fate on each unclaimed ring with no fate');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.shrine);
            expect(this.player1.fate).toBe(10);
        });

        it('should pay the full cost if not triggered', function () {
            this.player1.clickCard(this.ethos);
            this.player1.clickPrompt('Pass');
            expect(this.player1.fate).toBe(8);
        });

        it('should not trigger on an event that costs 0', function () {
            this.player1.clickCard(this.letGo);
            this.player1.clickCard('ornate-fan');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1.fate).toBe(10);
        });

        it('should not trigger on a card that is not an event', function () {
            this.player1.playAttachment(this.daisho, this.dojiWhisperer);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.daisho.location).toBe('play area');
            expect(this.player1.fate).toBe(9);
        });

        it('should not trigger on an opponent\'s event', function () {
            this.player1.pass();
            this.player2.clickCard(this.opponentEthos);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2.fate).toBe(8);
        });

        it('should not trigger while its province is broken', function () {
            this.province.isBroken = true;
            this.player1.clickCard(this.ethos);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1.fate).toBe(8);
        });
    });
});
