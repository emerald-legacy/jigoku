describe('Strike Beneath the Veil', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-toturi'],
                    hand: ['fine-katana', 'ornate-fan']
                },
                player2: {
                    inPlay: [],
                    hand: ['strike-beneath-the-veil', 'pillow-book']
                }
            });

            this.toturi = this.player1.findCardByName('akodo-toturi');
            this.fineKatana = this.player1.findCardByName('fine-katana');
            this.ornateFan = this.player1.findCardByName('ornate-fan');

            this.pillowBook = this.player2.findCardByName('pillow-book');
            this.strikeBeneathTheVeil = this.player2.findCardByName('strike-beneath-the-veil');

            this.player1.playAttachment(this.fineKatana, this.toturi);
            this.player2.playAttachment(this.pillowBook, this.toturi);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi],
                defenders: []
            });
        });

        it('gives skill penalty depending on number of attachments', function () {
            this.player2.clickCard(this.strikeBeneathTheVeil);
            expect(this.player2).toHavePrompt('Choose a character');

            this.player2.clickCard(this.toturi);
            expect(this.toturi.militarySkill).toBe(2);
            expect(this.toturi.politicalSkill).toBe(0);
            expect(this.getChatLogs(5)).toContain(
                'player2 plays Strike Beneath the Veil to give Akodo Toturi -6military and -6political'
            );
        });
    });
});

describe('Strike Beneath the Veil with characters without attachments', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-toturi', 'doji-whisperer'],
                    hand: ['fine-katana']
                },
                player2: {
                    inPlay: ['doji-challenger'],
                    hand: ['strike-beneath-the-veil']
                }
            });

            this.toturi = this.player1.findCardByName('akodo-toturi');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.fineKatana = this.player1.findCardByName('fine-katana');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.strike = this.player2.findCardByName('strike-beneath-the-veil');
        });

        it('should not allow choosing a participating character without attachments', function () {
            this.player1.playAttachment(this.fineKatana, this.toturi);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi, this.whisperer],
                defenders: [this.challenger]
            });

            this.player2.clickCard(this.strike);
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).toBeAbleToSelect(this.toturi);
            expect(this.player2).not.toBeAbleToSelect(this.whisperer);
            expect(this.player2).not.toBeAbleToSelect(this.challenger);
        });

        it('should not be playable when no participating character has an attachment', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi, this.whisperer],
                defenders: [this.challenger]
            });

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.strike);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.strike.location).toBe('hand');
        });
    });
});
