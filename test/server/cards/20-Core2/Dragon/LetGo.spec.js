describe('Let Go', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer'],
                    hand: ['let-go', 'fine-katana', 'prepared-ambush']
                },
                player2: {
                    inPlay: ['doji-challenger', 'doji-hotaru'],
                    hand: ['ornate-fan', 'self-understanding'],
                    provinces: ['manicured-garden']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.letGo = this.player1.findCardByName('let-go');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.hotaru = this.player2.findCardByName('doji-hotaru');
            this.garden = this.player2.findCardByName('manicured-garden');

            this.katana = this.player1.playAttachment('fine-katana', this.whisperer);
            this.fan = this.player2.playAttachment('ornate-fan', this.challenger);
            this.ambush = this.player1.playAttachment('prepared-ambush', this.garden);
            this.selfUnderstanding = this.player2.playAttachment('self-understanding', this.hotaru);
            expect(this.katana.parent).toBe(this.whisperer);
            expect(this.fan.parent).toBe(this.challenger);
            expect(this.ambush.parent).toBe(this.garden);
            expect(this.selfUnderstanding.parent).toBe(this.hotaru);
        });

        it('can choose an attachment on either side or on a province', function() {
            this.player1.clickCard(this.letGo);
            expect(this.player1).toHavePrompt('Let Go');
            expect(this.player1).toBeAbleToSelect(this.katana);
            expect(this.player1).toBeAbleToSelect(this.fan);
            expect(this.player1).toBeAbleToSelect(this.ambush);
        });

        it('cannot choose an attachment that can\'t be chosen as the target of an opponent\'s event', function() {
            this.player1.clickCard(this.letGo);
            expect(this.player1).toBeAbleToSelect(this.fan);
            expect(this.player1).not.toBeAbleToSelect(this.selfUnderstanding);
        });

        it('discards the chosen attachment', function() {
            this.player1.clickCard(this.letGo);
            this.player1.clickCard(this.fan);
            expect(this.fan.location).toBe('conflict discard pile');
            expect(this.challenger.attachments).not.toContain(this.fan);
            expect(this.getChatLogs(3)).toContain('player1 plays Let Go to discard Ornate Fan');
        });

        it('discards an attachment on a province', function() {
            this.player1.clickCard(this.letGo);
            this.player1.clickCard(this.ambush);
            expect(this.ambush.location).toBe('conflict discard pile');
        });
    });
});
