describe('Way of the Scorpion', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'bayushi-liar'],
                    hand: ['way-of-the-scorpion']
                },
                player2: {
                    inPlay: ['brash-samurai', { card: 'bayushi-manipulator', attachments: ['seal-of-the-crab'] }, 'doji-challenger']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.liar = this.player1.findCardByName('bayushi-liar');
            this.scorpion = this.player1.findCardByName('way-of-the-scorpion');
            this.brash = this.player2.findCardByName('brash-samurai');
            this.manipulator = this.player2.findCardByName('bayushi-manipulator');
            this.challenger = this.player2.findCardByName('doji-challenger');
        });

        it('dishonors a participating non-Scorpion character', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer, this.liar],
                defenders: [this.brash, this.manipulator]
            });
            this.player2.pass();
            this.player1.clickCard(this.scorpion);
            expect(this.player1).toHavePrompt('Way of the Scorpion');
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            this.player1.clickCard(this.brash);
            expect(this.brash.isDishonored).toBe(true);
            expect(this.getChatLogs(3)).toContain('player1 plays Way of the Scorpion to dishonor Brash Samurai');
        });

        it('cannot choose a character that is not participating', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer, this.liar],
                defenders: [this.brash, this.manipulator]
            });
            this.player2.pass();
            this.player1.clickCard(this.scorpion);
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
        });

        it('cannot choose a Scorpion character', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer, this.liar],
                defenders: [this.brash, this.manipulator]
            });
            this.player2.pass();
            this.player1.clickCard(this.scorpion);
            expect(this.liar.isParticipating()).toBe(true);
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.liar);
        });

        it('cannot choose a Scorpion character that gained another clan (ruling #335)', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer, this.liar],
                defenders: [this.brash, this.manipulator]
            });
            this.player2.pass();
            expect(this.manipulator.isParticipating()).toBe(true);
            expect(this.manipulator.isFaction('crab')).toBe(true);
            this.player1.clickCard(this.scorpion);
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.manipulator);
        });

        it('cannot be played outside a conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.scorpion);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.scorpion.location).toBe('hand');
        });
    });
});
