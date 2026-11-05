describe('Theatre of Honest Lies', function () {
    integration(function () {
        describe('On honor loss', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 6,
                        stronghold: 'theatre-of-honest-lies',
                        inPlay: ['bayushi-shoju'],
                        hand: ['backhanded-compliment', 'policy-debate']
                    },
                    player2: {
                        honor: 10,
                        fate: 10,
                        inPlay: ['adept-of-shadows'],
                        dynastyDeck: ['windswept-yurt'],
                        hand: [],
                        conflictDeck: ['seeker-of-knowledge']
                    }
                });
                this.backhand = this.player1.findCardByName('backhanded-compliment');
                this.shoju = this.player1.findCardByName('bayushi-shoju');
                this.policyDebate = this.player1.findCardByName('policy-debate');
                this.theatreOfHonestLies = this.player1.findCardByName('theatre-of-honest-lies');
                this.yurt = this.player2.placeCardInProvince('windswept-yurt', 'province 1');
                this.adeptOfShadows = this.player2.findCardByName('adept-of-shadows');
            });

            it('will trigger from an honor loss caused by the player', function () {
                this.player1.clickCard(this.backhand, 'hand');
                this.player1.clickPrompt('player2');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.theatreOfHonestLies);
            });

            it('will trigger from a honor loss caused by the opponent', function () {
                this.player1.clickPrompt('Pass');
                this.player2.clickCard('adept-of-shadows');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.theatreOfHonestLies);
            });

            it('will trigger from an honor transfer', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.shoju],
                    defenders: [this.adeptOfShadows]
                });
                this.player2.pass();
                this.player1.clickCard(this.policyDebate);
                this.player1.clickCard(this.shoju);
                this.player1.clickCard(this.adeptOfShadows);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.theatreOfHonestLies);
            });

            describe('when it is activated', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Pass');
                    this.player2.clickCard('adept-of-shadows');
                });

                it('draws a card', function () {
                    const initialHandSize = this.player1.hand.length;
                    this.player1.clickCard(this.theatreOfHonestLies);
                    expect(this.player1.hand.length).toBe(initialHandSize + 1);
                });
            });
        });

        describe('On honor gain', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 6,
                        stronghold: 'theatre-of-honest-lies',
                        inPlay: ['beautiful-entertainer'],
                        hand: ['backhanded-compliment', 'policy-debate']
                    },
                    player2: {
                        honor: 10,
                        fate: 10,
                        inPlay: ['adept-of-shadows', 'hero-of-three-trees'],
                        dynastyDeck: ['windswept-yurt'],
                        hand: [],
                        conflictDeck: ['seeker-of-knowledge']
                    }
                });
                this.backhand = this.player1.findCardByName('backhanded-compliment');
                this.entertainer = this.player1.findCardByName('beautiful-entertainer');
                this.policyDebate = this.player1.findCardByName('policy-debate');
                this.theatreOfHonestLies = this.player1.findCardByName('theatre-of-honest-lies');
                this.yurt = this.player2.placeCardInProvince('windswept-yurt', 'province 1');
                this.adeptOfShadows = this.player2.findCardByName('adept-of-shadows');
                this.heroOfThreeTrees = this.player2.findCardByName('hero-of-three-trees');
            });

            it('will trigger from an honor gain by the opponent', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.entertainer],
                    defenders: [this.heroOfThreeTrees]
                });
                this.player2.clickCard(this.heroOfThreeTrees);
                this.player2.clickPrompt('Gain 1 honor');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.theatreOfHonestLies);
            });

            it('will trigger from an honor transfer', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.entertainer],
                    defenders: [this.adeptOfShadows]
                });
                this.player2.pass();
                this.player1.clickCard(this.policyDebate);
                this.player1.clickCard(this.entertainer);
                this.player1.clickCard(this.adeptOfShadows);
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.theatreOfHonestLies);
            });

            describe('when it is activated', function () {
                beforeEach(function () {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.entertainer],
                        defenders: [this.heroOfThreeTrees]
                    });
                    this.player2.clickCard(this.heroOfThreeTrees);
                    this.player2.clickPrompt('Gain 1 honor');
                });

                it('takes 1 honor from the opponent', function () {
                    const initialScorpHonor = this.player1.honor;
                    const initialOtherHonor = this.player2.honor;
                    this.player1.clickCard(this.theatreOfHonestLies);
                    expect(this.player1.honor).toBe(initialScorpHonor + 1);
                    expect(this.player2.honor).toBe(initialOtherHonor - 1);
                });
            });
        });
    });
});
