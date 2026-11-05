describe('Akodo Asuka', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-asuka', 'matsu-berserker'],
                    hand: ['fine-katana', 'ornate-fan', 'banzai']
                },
                player2: {}
            });
            this.akodoAsuka = this.player1.findCardByName('akodo-asuka');
            this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
            this.katana = this.player1.findCardByName('fine-katana');
        });

        it('triggers after she wins a conflict', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.akodoAsuka],
                defenders: []
            });
            this.noMoreActions();
            expect(this.player1).toBeAbleToSelect(this.akodoAsuka);
        });

        it('draws a card from the top, depending on number of participants', function () {
            const initialHandSize = this.player1.hand.length;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.akodoAsuka, this.matsuBerserker],
                defenders: []
            });
            this.noMoreActions();
            this.player1.clickCard(this.akodoAsuka);

            expect(this.player1).toHavePrompt('Akodo Asuka');
            expect(this.player1).not.toHavePromptButton('Take nothing');
            this.player1.clickPrompt('Supernatural Storm (2)');
            expect(this.player1.hand.length).toBe(initialHandSize + 1);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Akodo Asuka to look at the top 2 cards of their conflict deck'
            );
            expect(this.getChatLogs(5)).toContain('player1 takes 1 card');
        });

        it('offers only the top X cards and shuffles the deck', function () {
            this.player1.moveCard('banzai', 'conflict deck');
            this.player1.moveCard('ornate-fan', 'conflict deck');
            this.player1.moveCard('fine-katana', 'conflict deck');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.akodoAsuka, this.matsuBerserker],
                defenders: []
            });
            this.noMoreActions();
            this.player1.clickCard(this.akodoAsuka);

            expect(this.player1).toHavePromptButton('Fine Katana');
            expect(this.player1).toHavePromptButton('Ornate Fan');
            expect(this.player1).not.toHavePromptButton('Banzai!');
            this.player1.clickPrompt('Ornate Fan');
            expect(this.player1.findCardByName('ornate-fan').location).toBe('hand');
            expect(this.player1.findCardByName('banzai').location).toBe('conflict deck');
            expect(this.getChatLogs(5)).toContain('player1 is shuffling their conflict deck');
        });
    });
});
