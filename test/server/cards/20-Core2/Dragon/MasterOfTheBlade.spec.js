describe('Master of the Blade', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['master-of-the-blade', 'brash-samurai'],
                    hand: ['policy-debate']
                },
                player2: {
                    inPlay: ['kakita-asami'],
                    hand: ['mirumoto-s-fury', 'banzai']
                }
            });

            this.master = this.player1.findCardByName('master-of-the-blade');
            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.policyDebate = this.player1.findCardByName('policy-debate');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.fury = this.player2.findCardByName('mirumoto-s-fury');
            this.banzai = this.player2.findCardByName('banzai');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.master, this.brashSamurai],
                defenders: [this.asami]
            });
        });

        it('should stop opponents\' card effects from bowing it and stop it bowing at the end of the conflict', function() {
            this.player2.pass();
            this.player1.clickCard(this.policyDebate);
            this.player1.clickCard(this.master);
            this.player1.clickCard(this.asami);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.master);
            this.player1.clickCard(this.master);
            expect(this.getChatLogs(5)).toContain('player1 uses Master of the Blade to prevent opponents\' actions from bowing Master of the Blade and stop it bowing at the end of the conflict');
            this.player1.clickPrompt('Banzai!');

            this.player2.clickCard(this.fury);
            expect(this.player2).toHavePrompt('Mirumoto\'s Fury');
            expect(this.player2).toBeAbleToSelect(this.brashSamurai);
            expect(this.player2).not.toBeAbleToSelect(this.master);
            this.player2.clickCard(this.brashSamurai);
            expect(this.brashSamurai.bowed).toBe(true);

            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Gain 2 honor');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.master.bowed).toBe(false);
            expect(this.asami.bowed).toBe(true);
        });

        it('should be bowable by opponents\' card effects if its ability was not used', function() {
            this.player2.clickCard(this.fury);
            expect(this.player2).toHavePrompt('Mirumoto\'s Fury');
            expect(this.player2).toBeAbleToSelect(this.master);
            this.player2.clickCard(this.master);
            expect(this.master.bowed).toBe(true);
        });

        it('should bow at the end of the conflict if its ability was not used', function() {
            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Gain 2 honor');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.master.bowed).toBe(true);
        });
    });
});

describe('Master of the Blade outside a conflict', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['master-of-the-blade']
                },
                player2: {
                    inPlay: ['kakita-asami'],
                    hand: ['unyielding-terms']
                }
            });
            this.master = this.player1.findCardByName('master-of-the-blade');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.unyieldingTerms = this.player2.findCardByName('unyielding-terms');
        });

        it('cannot use its Duel Strike in a duel outside a conflict ("for this conflict")', function() {
            this.player1.pass();
            this.player2.clickCard(this.unyieldingTerms);
            this.player2.clickCard(this.asami);
            this.player2.clickCard(this.master);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.master);
        });
    });
});
