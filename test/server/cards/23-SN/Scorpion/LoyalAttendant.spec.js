describe('Loyal Attendant', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['isawa-tadaka'],
                    hand: ['ornate-fan', 'fine-katana', 'banzai', 'let-go']
                },
                player2: {
                    inPlay: ['loyal-attendant'],
                    hand: ['ornate-fan', 'fine-katana', 'banzai', 'let-go']
                }
            });

            this.tadaka = this.player1.findCardByName('isawa-tadaka');
            this.attendant = this.player2.findCardByName('loyal-attendant');

            this.fan1 = this.player1.findCardByName('ornate-fan');
            this.katana1 = this.player1.findCardByName('fine-katana');
            this.fan2 = this.player2.findCardByName('ornate-fan');
            this.katana2 = this.player2.findCardByName('fine-katana');

            this.player1.playAttachment(this.fan1, this.tadaka);
            this.player2.playAttachment(this.fan2, this.attendant);
        });

        it('happy path', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.tadaka],
                defenders: [this.attendant]
            });

            // shouldn't work yet, no valid target
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.attendant);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.playAttachment(this.katana2, this.tadaka);
            this.player1.pass();

            this.player2.clickCard(this.attendant);
            expect(this.player2).toBeAbleToSelect(this.tadaka);
            this.player2.clickCard(this.tadaka);
            expect(this.player2).toHavePrompt('Select a card:');
            const matchingButtons = this.player2.currentPrompt().buttons.filter(button =>
                ['Fine Katana', 'Banzai!', 'Let Go'].includes(button.text)
            );
            expect(matchingButtons.length).toBe(2);
            expect(this.player2.currentPrompt().buttons.length).toBe(2);

            const conflictDiscardPileSize = this.player1.player.conflictDiscardPile.length;
            const hand = this.player1.player.hand.length;
            this.player2.clickPrompt(matchingButtons[0].text);
            expect(this.player1.player.conflictDiscardPile.length).toBe(conflictDiscardPileSize + 1);
            expect(this.player1.player.hand.length).toBe(hand - 1);
            expect(this.getChatLogs(5)).toContain('player2 uses Loyal Attendant to look at 2 random cards in player1\'s hand and discard one of them');
            expect(this.getChatLogs(5)).toContain('player2 chooses ' + matchingButtons[0].text + ' to be discarded');
            expect(this.getChatLogs(5)).toContain('Loyal Attendant sees ' + matchingButtons[0].text + ' and ' + matchingButtons[1].text);
        });
    });
});

describe('Loyal Attendant with characters on the other side than their controller', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['loyal-attendant', 'endless-plains-skirmisher'],
                    hand: ['fine-katana', 'fine-katana']
                },
                player2: {
                    inPlay: ['doji-whisperer', 'endless-plains-skirmisher'],
                    hand: ['ornate-fan']
                }
            });
            this.attendant = this.player1.findCardByName('loyal-attendant');
            this.skirmisher1 = this.player1.findCardByName('endless-plains-skirmisher');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.skirmisher2 = this.player2.findCardByName('endless-plains-skirmisher');
            const [katana1, katana2] = this.player1.filterCardsByName('fine-katana');
            this.player1.playAttachment(katana1, this.skirmisher1);
            this.player2.pass();
            this.player1.playAttachment(katana2, this.skirmisher2);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.attendant],
                defenders: [this.whisperer]
            });
            this.player2.clickCard(this.skirmisher2);
            this.player2.clickPrompt('player1');
            this.player1.clickCard(this.skirmisher1);
            this.player1.clickPrompt('player2');
        });

        it('chooses a character on the enemy side with your attachment, whoever controls it', function () {
            this.player2.pass();
            expect(this.game.currentConflict.attackers).toContain(this.skirmisher2);
            expect(this.game.currentConflict.defenders).toContain(this.skirmisher1);

            this.player1.clickCard(this.attendant);
            expect(this.player1).toBeAbleToSelect(this.skirmisher1);
            expect(this.player1).not.toBeAbleToSelect(this.skirmisher2);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
        });
    });
});
