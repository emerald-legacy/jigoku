describe('Matsu Seventh Legion', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-seventh-legion', 'brash-samurai'],
                    hand: ['fine-katana', 'ornate-fan']
                },
                player2: {
                    inPlay: ['matsu-berserker', { card: 'ikoma-prodigy', attachments: ['favored-mount'] }, 'doji-whisperer'],
                    hand: ['messenger-of-misery']
                }
            });
            this.legion = this.player1.findCardByName('matsu-seventh-legion');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.prodigy = this.player2.findCardByName('ikoma-prodigy');
            this.mount = this.player2.findCardByName('favored-mount');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('can only have Weapon attachments', function() {
            this.player1.clickCard('ornate-fan');
            expect(this.player1).toHavePrompt('Ornate Fan');
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.legion);
            this.player1.clickCard(this.brash);
            this.player2.pass();
            this.player1.playAttachment('fine-katana', this.legion);
            expect(this.legion.attachments.map((card) => card.name)).toEqual(['Fine Katana']);
        });

        it('prevents Courtier characters from being declared as defenders while it attacks', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.legion]
            });
            expect(this.player2).toHavePrompt('Choose defenders');
            this.player2.clickCard(this.berserker);
            this.player2.clickCard(this.whisperer);
            this.player2.clickCard(this.prodigy);
            this.player2.clickPrompt('Done');
            expect(this.berserker.isDefending()).toBe(true);
            expect(this.whisperer.isDefending()).toBe(false);
            expect(this.prodigy.isDefending()).toBe(false);
        });

        it('does not restrict Courtier defenders when it is not attacking', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.brash]
            });
            expect(this.player2).toHavePrompt('Choose defenders');
            this.player2.clickCard(this.berserker);
            this.player2.clickCard(this.whisperer);
            this.player2.clickPrompt('Done');
            expect(this.berserker.isDefending()).toBe(true);
            expect(this.whisperer.isDefending()).toBe(true);
        });

        // ruling #393: Courtiers can still be played into the conflict or moved there by card effects
        it('lets Courtiers be played into or moved to the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.legion],
                defenders: [this.berserker]
            });
            this.player2.clickCard(this.mount);
            expect(this.prodigy.isParticipating()).toBe(true);
            this.player1.pass();
            this.player2.clickCard('messenger-of-misery');
            this.player2.clickPrompt('0');
            this.player2.clickPrompt('Conflict');
            expect(this.player2.findCardByName('messenger-of-misery').isParticipating()).toBe(true);
        });
    });
});
