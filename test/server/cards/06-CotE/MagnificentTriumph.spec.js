describe('Magnificent Triumph', function() {
    integration(function() {
        describe('Magnificent Triumph\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['mirumoto-raitsugu','doomed-shugenja'],
                        hand: ['magnificent-triumph']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'doji-challenger'],
                        hand: ['banzai']
                    }
                });
                this.mirumotoRaitsugu = this.player1.findCardByName('mirumoto-raitsugu');
                this.doomedShugenja = this.player1.findCardByName('doomed-shugenja');
                this.magnificentTriumph = this.player1.findCardByName('magnificent-triumph');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.banzai = this.player2.findCardByName('banzai');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.mirumotoRaitsugu, this.doomedShugenja],
                    defenders: [this.dojiWhisperer, this.dojiChallenger]
                });
                this.player2.pass();
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickCard(this.dojiWhisperer);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
            });

            it('should allow you to select characters that have won a duel', function() {
                this.player2.pass();
                this.player1.clickCard(this.magnificentTriumph);
                expect(this.player1).toHavePrompt('Magnificent Triumph');
                expect(this.player1).toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).not.toBeAbleToSelect(this.doomedShugenja);
                expect(this.player1).not.toBeAbleToSelect(this.dojiChallenger);
            });

            it('should give the target +2/+2', function() {
                const militarySkill = this.mirumotoRaitsugu.militarySkill;
                const politicalSkill = this.mirumotoRaitsugu.politicalSkill;
                this.player2.pass();
                this.player1.clickCard(this.magnificentTriumph);
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.mirumotoRaitsugu.militarySkill).toBe(militarySkill + 2);
                expect(this.mirumotoRaitsugu.politicalSkill).toBe(politicalSkill + 2);
            });

            it('should make the target immune to opponent\'s events', function() {
                this.player2.pass();
                this.player1.clickCard(this.magnificentTriumph);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player2.clickCard(this.banzai);
                expect(this.player2).not.toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player2).toBeAbleToSelect(this.doomedShugenja);
                expect(this.player2).toBeAbleToSelect(this.dojiChallenger);
            });

            it('should only last to the end of the conflict', function() {
                const militarySkill = this.mirumotoRaitsugu.militarySkill;
                const politicalSkill = this.mirumotoRaitsugu.politicalSkill;
                this.player2.pass();
                this.player1.clickCard(this.magnificentTriumph);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.mirumotoRaitsugu.militarySkill).toBe(militarySkill);
                expect(this.mirumotoRaitsugu.politicalSkill).toBe(politicalSkill);
            });

        });
    });
});

describe('Magnificent Triumph and a duel winner that left play', function() {
    integration(function() {
        it('can\'t choose the character once it was played again', function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    inPlay: ['adept-of-shadows'],
                    hand: ['magnificent-triumph']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu']
                }
            });
            this.adept = this.player1.findCardByName('adept-of-shadows');
            this.raitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.adept],
                defenders: [this.raitsugu]
            });
            this.player2.clickCard(this.raitsugu);
            this.player2.clickCard(this.adept);
            this.player1.clickPrompt('5');
            this.player2.clickPrompt('1');
            this.player1.clickCard(this.adept);
            this.player2.pass();
            this.player1.clickCard(this.adept);
            this.player1.clickPrompt('0');
            this.player1.clickPrompt('Conflict');
            this.player2.pass();
            expect(this.adept.isParticipating()).toBe(true);

            this.player1.clickCard('magnificent-triumph');
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.player1.findCardByName('magnificent-triumph').location).toBe('hand');
        });
    });
});
