describe('Giver of Gifts 2', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['giver-of-gifts-2', 'shinjo-outrider', 'moto-youth', 'doomed-shugenja'],
                    hand: ['fine-katana', 'force-of-the-river', 'ornate-fan']
                },
                player2: {
                    inPlay: ['bayushi-liar'],
                    hand: ['pacifism']
                }
            });

            this.giverOfGifts = this.player1.findCardByName('giver-of-gifts-2');
            this.outrider = this.player1.findCardByName('shinjo-outrider');
            this.youth = this.player1.findCardByName('moto-youth');
            this.katana = this.player1.findCardByName('fine-katana');
            this.river = this.player1.findCardByName('force-of-the-river');
            this.fan = this.player1.findCardByName('ornate-fan');
            this.doomed = this.player1.findCardByName('doomed-shugenja');

            this.liar = this.player2.findCardByName('bayushi-liar');
            this.pacifism = this.player2.findCardByName('pacifism');

            this.player1.playAttachment(this.katana, this.outrider);
            this.player2.pass();
            this.player1.playAttachment(this.fan, this.giverOfGifts);
        });

        it('should only allow targeting attachments you control', function () {
            this.player2.playAttachment(this.pacifism, this.outrider);

            this.player1.clickCard(this.giverOfGifts);
            expect(this.player1).toBeAbleToSelect(this.katana);
            expect(this.player1).toBeAbleToSelect(this.fan);
            expect(this.player1).not.toBeAbleToSelect(this.pacifism);
        });

        it('should allow moving attachment to another character controlled by the same player', function () {
            this.player2.pass();

            this.player1.clickCard(this.giverOfGifts);
            this.player1.clickCard(this.katana);
            expect(this.player1).toBeAbleToSelect(this.giverOfGifts);
            expect(this.player1).toBeAbleToSelect(this.youth);
            expect(this.player1).not.toBeAbleToSelect(this.outrider);
            expect(this.player1).not.toBeAbleToSelect(this.liar);

            this.player1.clickCard(this.youth);
            expect(this.youth.attachments).toContain(this.katana);
            expect(this.outrider.attachments).not.toContain(this.katana);

            expect(this.getChatLogs(2)).toContain(
                'player1 uses Giver of Gifts to move Fine Katana to another character'
            );
            expect(this.getChatLogs(1)).toContain('player1 moves Fine Katana to Moto Youth');
        });

        it('should not target an attachment controlled by opponent (even if on your character)', function () {
            this.player2.playAttachment(this.pacifism, this.outrider);
            // Pacifism is owned and controlled by player2, even though it's on player1's character
            this.player1.clickCard(this.giverOfGifts);
            expect(this.player1).not.toBeAbleToSelect(this.pacifism);
        });

        it('should not allow moving attachment to a character controlled by a different player', function () {
            this.player2.pass();

            this.player1.clickCard(this.giverOfGifts);
            this.player1.clickCard(this.fan);
            expect(this.player1).not.toBeAbleToSelect(this.liar);
            expect(this.player1).toBeAbleToSelect(this.outrider);
            expect(this.player1).toBeAbleToSelect(this.youth);
        });

        it('should not allow selecting the character the attachment is already on', function () {
            this.player2.pass();

            this.player1.clickCard(this.giverOfGifts);
            this.player1.clickCard(this.katana);
            expect(this.player1).not.toBeAbleToSelect(this.outrider);
        });

        it('should respect attachment restrictions when choosing a destination', function () {
            this.player2.pass();
            this.player1.playAttachment(this.river, this.doomed);

            this.player2.pass();
            this.player1.clickCard(this.giverOfGifts);
            this.player1.clickCard(this.river);
            // Force of the River requires Shugenja - only doomed is valid, but it's the current parent
            // So no valid targets and it should not prompt for a destination
            expect(this.player1).not.toBeAbleToSelect(this.outrider);
            expect(this.player1).not.toBeAbleToSelect(this.giverOfGifts);
        });
    });
});
