describe('Proving Ground', function() {
    integration(function() {
        describe('Proving Ground\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-challenger'],
                        hand: ['banzai','game-of-sadane'],
                        dynastyDiscard: ['proving-ground']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu']
                    }
                });
                this.noMoreActions();
                this.provingGround = this.player1.placeCardInProvince('proving-ground', 'province 1');
                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.sadane = this.player1.findCardByName('game-of-sadane');
                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');

                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: [this.mirumotoRaitsugu]
                });
            });

            it('should trigger after winning a duel', function () {
                this.player2.pass();
                this.player1.clickCard(this.sadane);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.provingGround);
            });

            it('should not trigger after losing a duel', function() {
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player2.clickCard(this.dojiChallenger);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should draw a card', function() {
                const hand = this.player1.hand.length;
                this.player2.pass();
                this.player1.clickCard(this.sadane);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.provingGround);
                this.player1.clickCard(this.provingGround);
                expect(this.player1.hand.length).toBe(hand);
            });

            it('should work twice a round', function() {
                const hand = this.player1.hand.length;
                this.player2.pass();
                this.player1.clickCard(this.sadane);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.provingGround);
                this.player1.clickCard(this.provingGround);
                expect(this.player1.hand.length).toBe(hand);
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player2.clickCard(this.dojiChallenger);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.provingGround);
                this.player1.clickCard(this.provingGround);
                expect(this.player1.hand.length).toBe(hand + 1);
            });
        });
    });
});

describe('Proving Ground with two winners', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['mirumoto-hitomi']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu', 'doomed-shugenja'],
                    dynastyDiscard: ['proving-ground']
                }
            });
            this.hitomi = this.player1.findCardByName('mirumoto-hitomi');
            this.raitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.shugenja = this.player2.findCardByName('doomed-shugenja');
            this.provingGround = this.player2.placeCardInProvince('proving-ground', 'province 1');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.hitomi],
                defenders: [this.raitsugu, this.shugenja],
                type: 'military'
            });
            this.player2.pass();
            this.player1.clickCard(this.hitomi);
            this.player1.clickCard(this.raitsugu);
            this.player1.clickCard(this.shugenja);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
        });

        it('triggers once for each winning character you control (EmeraldDB ruling)', function() {
            const hand = this.player2.hand.length;
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.provingGround);
            this.player2.clickCard(this.raitsugu);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.provingGround);
            expect(this.player2.hand.length).toBe(hand + 2);
        });
    });
});

