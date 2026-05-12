describe('Till the Last One Falls!', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai'],
                    hand: ['till-the-last-one-falls-', 'till-the-last-one-falls-']
                },
                player2: {
                    inPlay: ['doji-challenger', 'solemn-scholar'],
                    hand: []
                }
            });

            this.brash = this.player1.findCardByName('brash-samurai');
            this.cards = this.player1.filterCardsByName('till-the-last-one-falls-');
            this.card = this.cards[0];
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.scholar = this.player2.findCardByName('solemn-scholar');
        });

        it('should give +2 per enemy character when outnumbered', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash],
                defenders: [this.challenger, this.scholar]
            });

            let brashMil = this.brash.getMilitarySkill();
            let brashPol = this.brash.getPoliticalSkill();

            this.player2.pass();
            this.player1.clickCard(this.card);
            expect(this.player1).toBeAbleToSelect(this.brash);
            this.player1.clickCard(this.brash);
            expect(this.brash.getMilitarySkill()).toBe(brashMil + 4);
            expect(this.brash.getPoliticalSkill()).toBe(brashPol + 4);
            expect(this.getChatLogs(5)).toContain('player1 plays Till the Last One Falls! to give Brash Samurai +4military/+4political');
        });

        it('should not be playable when not outnumbered', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash],
                defenders: [this.challenger]
            });

            this.player2.pass();
            this.player1.clickCard(this.card);
            expect(this.card.location).toBe('hand');
        });

        it('should only target own participating characters', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash],
                defenders: [this.challenger, this.scholar]
            });

            this.player2.pass();
            this.player1.clickCard(this.card);
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.scholar);
            this.player1.clickCard(this.brash);
        });

        it('should be limited to once per conflict', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash],
                defenders: [this.challenger, this.scholar]
            });

            this.player2.pass();
            this.player1.clickCard(this.cards[0]);
            this.player1.clickCard(this.brash);

            this.player2.pass();
            this.player1.clickCard(this.cards[1]);
            expect(this.cards[1].location).toBe('hand');
        });
    });
});
