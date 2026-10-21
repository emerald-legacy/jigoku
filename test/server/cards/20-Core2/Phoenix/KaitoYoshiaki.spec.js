describe('Kaito Yoshiaki', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kaito-yoshiaki','isawa-ujina'],
                    hand: ['jealous-ancestor']
                },
                player2: {
                    hand: ['fine-katana'],
                    inPlay: ['brash-samurai', 'doji-kuwanan','doji-kuzunobu']
                }
            });

            this.kaitoYoshiaki = this.player1.findCardByName('kaito-yoshiaki');
            this.isawaUjina = this.player1.findCardByName('isawa-ujina');
            this.jealousAncestor = this.player1.findCardByName('jealous-ancestor');

            this.brash = this.player2.findCardByName('brash-samurai');
            this.brash.fate = 2;
            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.kuzunobu = this.player2.findCardByName('doji-kuzunobu');

            this.noMoreActions();
        });

        it('choose character by cost', function () {
            this.initiateConflict({
                attackers: [this.kaitoYoshiaki,this.isawaUjina],
                defenders: [this.brash, this.kuzunobu,this.kuwanan]
            });
            this.player2.pass();
            this.player1.clickCard(this.kaitoYoshiaki);

            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).toBeAbleToSelect(this.kuzunobu);
            expect(this.player1).not.toBeAbleToSelect(this.kuwanan);
        });

        it('set base to zero', function () {
            this.initiateConflict({
                attackers: [this.kaitoYoshiaki],
                defenders: [this.brash]
            });
            this.player2.clickCard(this.brash);
            this.player1.clickCard(this.kaitoYoshiaki);
            this.player1.clickCard(this.brash);
            expect(this.brash.militarySkill).toBe(2);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Kaito Yoshiaki to set the base skills of Brash Samurai to 0military/0political'
            );
        });

        it('set base to zero, and remove fate when tainted', function () {
            this.brash.taint();
            this.initiateConflict({
                attackers: [this.kaitoYoshiaki],
                defenders: [this.brash]
            });
            this.player2.clickCard(this.brash);
            this.player1.clickCard(this.kaitoYoshiaki);
            this.player1.clickCard(this.brash);
            expect(this.brash.militarySkill).toBe(4); // honored and tainted
            expect(this.brash.politicalSkill).toBe(4); // honored and tainted
            expect(this.brash.fate).toBe(1);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Kaito Yoshiaki to remove a fate from and set the base skills of Brash Samurai to 0military/0political'
            );
        });

        it('set base to zero, and remove fate when corrupt', function () {
            this.initiateConflict({
                attackers: [this.kaitoYoshiaki],
                defenders: [this.brash]
            });
            this.player2.clickCard(this.brash);

            this.player1.clickCard(this.jealousAncestor);
            this.player1.clickPrompt('Play Jealous Ancestor as an attachment');
            this.player1.clickCard(this.brash);

            this.player2.pass();

            this.player1.clickCard(this.kaitoYoshiaki);
            this.player1.clickCard(this.brash);
            expect(this.brash.militarySkill).toBe(2);
            expect(this.brash.fate).toBe(1);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Kaito Yoshiaki to remove a fate from and set the base skills of Brash Samurai to 0military/0political'
            );
        });

        it('can choose itself', function () {
            this.initiateConflict({
                attackers: [this.kaitoYoshiaki, this.isawaUjina],
                defenders: [this.brash]
            });
            this.player2.pass();
            this.player1.clickCard(this.kaitoYoshiaki);
            expect(this.player1).toBeAbleToSelect(this.kaitoYoshiaki);
        });
    });
});

describe('Kaito Yoshiaki and a token', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kaito-yoshiaki']
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    dynastyDiscard: ['ashigaru-encampment']
                }
            });
            this.kaito = this.player1.findCardByName('kaito-yoshiaki');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.encampment = this.player2.placeCardInProvince('ashigaru-encampment');
            this.encampment.facedown = false;
            this.player1.pass();
            this.player2.clickCard(this.encampment);
            this.ashigaru = this.player2.player.cardsInPlay.find((card) => card.name === 'Ashigaru Recruit');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kaito],
                defenders: [this.ashigaru, this.whisperer]
            });
            this.player2.pass();
        });

        it('can\'t choose a token, which has no printed cost', function () {
            this.player1.clickCard(this.kaito);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.ashigaru);
        });
    });
});
