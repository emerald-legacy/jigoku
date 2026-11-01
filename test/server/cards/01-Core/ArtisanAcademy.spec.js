describe('Artisan Academy', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    dynastyDeck: ['artisan-academy'],
                    inPlay: ['doji-whisperer', 'agasha-swordsmith'],
                    hand: ['ornate-fan', 'steward-of-law', 'tattooed-wanderer', 'levy']
                }
            });
            this.artisanAcademy = this.player1.placeCardInProvince('artisan-academy', 'province 1');
        });

        describe('Before activating Artisan Academy', function () {
            it('should have the top card facedown', function () {
                expect(this.player1.player.isTopConflictCardShown(this.player1.player)).toBe(false);
                expect(this.player1.player.isTopConflictCardShown(this.player2.player)).toBe(false);
            });
        });

        describe('When activating Artisan Academy', function () {
            it('should turn the top card face up', function () {
                this.player1.clickCard(this.artisanAcademy);
                expect(this.player1.player.isTopConflictCardShown(this.player1.player)).toBe(true);
                expect(this.player1.player.isTopConflictCardShown(this.player2.player)).toBe(true);
            });

            it('should add a playable location', function () {
                this.player1.clickCard(this.artisanAcademy);
                expect(this.player1.player.playableLocations.length).toBe(7); //stronghold became a playable location by default
            });

            it('should make the top card playable if it\'s an attachment', function () {
                this.ornateFan = this.player1.moveCard('ornate-fan', 'conflict deck');
                expect(this.player1.player.conflictDeck[0]).toBe(this.ornateFan);
                this.player1.clickCard(this.artisanAcademy);
                this.player2.clickPrompt('Pass');
                this.player1.clickCard(this.ornateFan);
                expect(this.player1).toHavePrompt('Choose a card');

                this.dojiWhisperer = this.player1.clickCard('doji-whisperer');
                expect(this.dojiWhisperer.attachments).toContain(this.ornateFan);
            });

            it('should make the top card playable if it\'s a character', function () {
                this.steward = this.player1.moveCard('steward-of-law', 'conflict deck');
                this.player1.clickCard(this.artisanAcademy);
                this.player2.clickPrompt('Pass');
                this.player1.clickCard(this.steward);
                expect(this.player1).toHavePrompt('Choose additional fate');

                this.player1.clickPrompt('0');
                expect(this.steward.location).toBe('play area');
            });

            it('should stop the top card being visible once it has been played', function () {
                this.ornateFan = this.player1.moveCard('ornate-fan', 'conflict deck');
                expect(this.player1.player.conflictDeck[0]).toBe(this.ornateFan);
                this.player1.clickCard(this.artisanAcademy);
                this.player2.clickPrompt('Pass');
                this.player1.clickCard(this.ornateFan);
                expect(this.player1).toHavePrompt('Choose a card');

                this.dojiWhisperer = this.player1.clickCard('doji-whisperer');
                expect(this.dojiWhisperer.attachments).toContain(this.ornateFan);
                expect(this.player1.player.isTopConflictCardShown(this.player1.player)).toBe(false);
                expect(this.player1.player.isTopConflictCardShown(this.player2.player)).toBe(false);
            });

            it('should stop the top card being visible if the deck is shuffled', function () {
                this.ornateFan = this.player1.moveCard('ornate-fan', 'conflict deck');
                this.steward = this.player1.moveCard('steward-of-law', 'conflict deck');
                expect(this.player1.player.conflictDeck[0]).toBe(this.steward);
                this.player1.clickCard(this.artisanAcademy);
                this.player2.clickPrompt('Pass');
                this.player1.clickCard('agasha-swordsmith');
                expect(this.player1).toHavePrompt('Agasha Swordsmith');
                this.player1.clickPrompt('Ornate Fan');
                expect(this.ornateFan.location).toBe('hand');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.player1.player.isTopConflictCardShown(this.player1.player)).toBe(false);
                expect(this.player1.player.isTopConflictCardShown(this.player2.player)).toBe(false);
            });

            it('should stop the top card being visible once the phase ends', function () {
                this.player1.clickCard(this.artisanAcademy);
                expect(this.player1.player.isTopConflictCardShown(this.player1.player)).toBe(true);
                expect(this.player1.player.isTopConflictCardShown(this.player2.player)).toBe(true);
                this.flow.finishConflictPhase();
                expect(this.player1.player.isTopConflictCardShown(this.player1.player)).toBe(false);
                expect(this.player1.player.isTopConflictCardShown(this.player2.player)).toBe(false);
            });
        });
    });
});

describe('Artisan Academy after the deck is reordered', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    dynastyDeck: ['artisan-academy'],
                    inPlay: ['doji-whisperer'],
                    hand: ['assassination', 'fine-katana', 'ornate-fan']
                },
                player2: {
                    dynastyDiscard: ['truthseeker'],
                    hand: ['charge']
                }
            });
            this.artisanAcademy = this.player1.placeCardInProvince('artisan-academy', 'province 1');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.ornateFan = this.player1.moveCard('ornate-fan', 'conflict deck');
            this.fineKatana = this.player1.moveCard('fine-katana', 'conflict deck');
            this.assassination = this.player1.moveCard('assassination', 'conflict deck');
            this.truthseeker = this.player2.placeCardInProvince('truthseeker', 'province 1');
            this.truthseeker.facedown = false;

            this.player1.clickCard(this.artisanAcademy);
            expect(this.player1.player.conflictDeck[0]).toBe(this.assassination);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.whisperer],
                defenders: []
            });
            this.player2.clickCard('charge');
            this.player2.clickCard(this.truthseeker);
            this.player2.clickCard(this.truthseeker);
            this.player2.clickPrompt('player1\'s Conflict Deck');
            this.player2.clickPrompt('Fine Katana');
            this.player2.clickPrompt('Ornate Fan');
        });

        it('stops showing the top card once the revealed card is no longer on top', function () {
            expect(this.player1.player.conflictDeck[0]).toBe(this.fineKatana);
            expect(this.player1.player.isTopConflictCardShown(this.player2.player)).toBe(false);
        });
    });
});
