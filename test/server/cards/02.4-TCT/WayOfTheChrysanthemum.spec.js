describe('Way of the Chrysanthemum', function () {
    integration(function () {
        describe('during the draw phase bid', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        honor: 10,
                        fate: 5,
                        hand: ['way-of-the-chrysanthemum']
                    },
                    player2: {
                        honor: 10
                    }
                });
                this.chrysanthemum = this.player1.findCardByName('way-of-the-chrysanthemum');
            });

            it('gains as much honor as the opponent gave you', function () {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('4');

                expect(this.player1.honor).toBe(13);
                expect(this.player2.honor).toBe(7);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.chrysanthemum);

                this.player1.clickCard(this.chrysanthemum);
                expect(this.player1.honor).toBe(16);
                expect(this.player2.honor).toBe(7);
                expect(this.chrysanthemum.location).toBe('conflict discard pile');
            });

            it('does not trigger when you give honor', function () {
                this.player1.clickPrompt('4');
                this.player2.clickPrompt('1');

                expect(this.player1.honor).toBe(7);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Initiate an action');
            });

            it('does not trigger when the bids are equal', function () {
                this.player1.clickPrompt('3');
                this.player2.clickPrompt('3');

                expect(this.player1.honor).toBe(10);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Initiate an action');
            });
        });

        describe('against Silent Ones Monastery', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        honor: 10,
                        hand: ['way-of-the-chrysanthemum']
                    },
                    player2: {
                        honor: 10,
                        provinces: ['silent-ones-monastery']
                    }
                });
                this.chrysanthemum = this.player1.findCardByName('way-of-the-chrysanthemum');
            });

            it('does not trigger and prints no honor line when the limit prevents all of the honor given', function () {
                this.player1.player.modifyHonor(2);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');

                expect(this.player1.honor).toBe(12);
                expect(this.player2.honor).toBe(10);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Initiate an action');
                expect(this.getChatLogs(10).filter((line) => line.includes(' gives '))).toEqual([]);
            });
        });

        describe('during a duel', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        honor: 10,
                        fate: 10,
                        inPlay: ['doji-whisperer', 'kakita-asami'],
                        hand: ['way-of-the-chrysanthemum', 'way-of-the-chrysanthemum', 'policy-debate']
                    },
                    player2: {
                        honor: 10,
                        inPlay: ['attendant-to-the-emperor']
                    }
                });
                this.chrysanthemum1 = this.player1.filterCardsByName('way-of-the-chrysanthemum')[0];
                this.chrysanthemum2 = this.player1.filterCardsByName('way-of-the-chrysanthemum')[1];
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.asami = this.player1.findCardByName('kakita-asami');
                this.policyDebate = this.player1.findCardByName('policy-debate');
                this.attendant = this.player2.findCardByName('attendant-to-the-emperor');
                this.startDuel = function () {
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'political',
                        attackers: [this.whisperer],
                        defenders: [this.attendant]
                    });
                    this.player2.pass();
                    this.player1.clickCard(this.policyDebate);
                    this.player1.clickCard(this.whisperer);
                    this.player1.clickCard(this.attendant);
                };
            });

            it('triggers on the duel honor bid', function () {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.noMoreActions();
                this.startDuel();
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('3');

                expect(this.player1.honor).toBe(12);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.chrysanthemum1);
                expect(this.player1.honor).toBe(14);
            });

            it('can be played only once per round', function () {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.chrysanthemum1);
                expect(this.player1.honor).toBe(12);
                this.noMoreActions();

                this.startDuel();
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('3');

                expect(this.player1.honor).toBe(14);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.chrysanthemum2.location).toBe('hand');
            });

            it('does not trigger when honor is taken outside a bid', function () {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.noMoreActions();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.whisperer, this.asami],
                    defenders: [this.attendant]
                });
                this.player2.pass();
                this.player1.clickCard(this.asami);

                expect(this.player1.honor).toBe(11);
                expect(this.player2.honor).toBe(9);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });
        });
    });
});
