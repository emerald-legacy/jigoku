describe('Collector of Favors', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'brash-samurai'],
                    hand: ['collector-of-favors']
                },
                player2: {
                    inPlay: ['bayushi-liar', 'kakita-asami', 'doji-challenger']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.liar = this.player2.findCardByName('bayushi-liar');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.collector = this.player1.findCardByName('collector-of-favors');
        });

        it('can only be attached to a Courtier character', function() {
            this.player1.clickCard(this.collector);
            expect(this.player1).toHavePrompt('Collector of Favors');
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.liar);
            expect(this.player1).not.toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
        });

        describe('when attached', function() {
            beforeEach(function() {
                this.player1.playAttachment(this.collector, this.whisperer);
            });

            it('gives +1 political skill', function() {
                expect(this.whisperer.getPoliticalSkill()).toBe(4);
            });

            it('lets the attached character gain 1 fate after it wins a conflict', function() {
                const fate = this.player1.fate;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.whisperer],
                    defenders: [this.liar]
                });
                this.noMoreActions();
                expect(this.getChatLogs(5)).toContain('player1 won a political conflict 4 vs 3');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                this.player1.clickCard(this.whisperer);
                expect(this.getChatLogs(5)).toContain('player1 uses Doji Whisperer\'s gained ability from Collector of Favors to gain 1 fate');
                expect(this.player1.fate).toBe(fate + 1);
            });

            it('does not trigger when the attached character loses a conflict', function() {
                const fate = this.player1.fate;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.whisperer],
                    defenders: [this.liar, this.asami]
                });
                this.noMoreActions();
                expect(this.getChatLogs(5)).toContain('player2 won a political conflict 6 vs 4');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1.fate).toBe(fate);
            });
        });
    });
});
