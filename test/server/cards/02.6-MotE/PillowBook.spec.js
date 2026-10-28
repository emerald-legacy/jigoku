describe('Pillow Book', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    inPlay: ['doji-whisperer', 'brash-samurai'],
                    hand: ['pillow-book', 'mono-no-aware', 'fine-katana', 'ornate-fan']
                },
                player2: {
                    inPlay: ['bayushi-liar']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.liar = this.player2.findCardByName('bayushi-liar');
            this.monoNoAware = this.player1.findCardByName('mono-no-aware');
            this.pillowBook = this.player1.playAttachment('pillow-book', this.whisperer);
            this.ornateFan = this.player1.moveCard('ornate-fan', 'conflict deck');
            this.fineKatana = this.player1.moveCard('fine-katana', 'conflict deck');
        });

        it('cannot be used outside a conflict', function() {
            this.player2.pass();
            this.player1.clickCard(this.pillowBook);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.player1.player.isTopConflictCardShown(this.player1.player)).toBe(false);
        });

        it('cannot be used while the attached character is not participating', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.brash],
                defenders: [this.liar]
            });
            this.player2.pass();
            this.player1.clickCard(this.pillowBook);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.player1.player.isTopConflictCardShown(this.player1.player)).toBe(false);
        });

        describe('during a conflict', function() {
            beforeEach(function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.whisperer],
                    defenders: [this.liar]
                });
                this.player2.pass();
            });

            it('reveals the top card of the conflict deck and lets you play it', function() {
                expect(this.player1.player.conflictDeck[0]).toBe(this.fineKatana);
                this.player1.clickCard(this.pillowBook);
                expect(this.getChatLogs(5)).toContain('player1 uses Pillow Book to make the top card of their deck playable until the end of the conflict');
                expect(this.player1.player.isTopConflictCardShown(this.player1.player)).toBe(true);
                expect(this.player1.player.isTopConflictCardShown(this.player2.player)).toBe(true);
                this.player2.pass();
                this.player1.clickCard(this.fineKatana);
                expect(this.player1).toHavePrompt('Choose a card');
                this.player1.clickCard(this.whisperer);
                expect(this.whisperer.attachments).toContain(this.fineKatana);
                expect(this.player1.player.conflictDeck[0]).toBe(this.ornateFan);
                expect(this.player1.player.isTopConflictCardShown(this.player1.player)).toBe(false);
            });

            it('stops at the end of the conflict', function() {
                this.player1.clickCard(this.pillowBook);
                expect(this.player1.player.isTopConflictCardShown(this.player1.player)).toBe(true);
                this.noMoreActions();
                expect(this.getChatLogs(5)).toContain('player1 won a political conflict 3 vs 3');
                expect(this.player1.player.isTopConflictCardShown(this.player1.player)).toBe(true);
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.player1.player.isTopConflictCardShown(this.player1.player)).toBe(false);
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.fineKatana);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.fineKatana.location).toBe('conflict deck');
            });

            // ruling #509: the revealed card leaving the top of the deck ends the effect
            it('does not make the next card playable once the revealed card leaves the deck', function() {
                this.player1.clickCard(this.pillowBook);
                this.player2.pass();
                this.player1.clickCard(this.monoNoAware);
                expect(this.fineKatana.location).toBe('hand');
                expect(this.player1.player.conflictDeck[0]).toBe(this.ornateFan);
                expect(this.player1.player.isTopConflictCardShown(this.player1.player)).toBe(false);
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.ornateFan);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.ornateFan.location).toBe('conflict deck');
            });
        });
    });
});
