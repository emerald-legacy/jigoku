describe('Relentless Gloryseeker', function () {
    integration(function () {
        describe('Relentless Gloryseeker Reaction Ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: [
                            'relentless-gloryseeker',
                            'ikoma-message-runner'
                        ],
                        hand: ['embrace-death','assassination']
                    },
                    player2: {
                        inPlay: ['moto-chagatai'],
                        hand: ['assassination']
                    }
                });

                this.relentlessGloryseeker = this.player1.findCardByName(
                    'relentless-gloryseeker'
                );
                this.messageRunner = this.player1.findCardByName(
                    'ikoma-message-runner'
                );
                this.assassinationP1 = this.player1.findCardByName('assassination');
                this.embraceDeath =
                    this.player1.findCardByName('embrace-death');
                this.chagatai = this.player2.findCardByName('moto-chagatai');
                this.assassinationP2 =
                    this.player2.findCardByName('assassination');
            });

            it('returns to play after being sacrificed', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.relentlessGloryseeker, this.messageRunner],
                    defenders: [this.chagatai]
                });

                this.player2.pass();
                this.player1.pass();

                this.player1.clickCard(this.embraceDeath);
                this.player1.clickCard(this.chagatai);
                this.player1.clickCard(this.relentlessGloryseeker);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(
                    this.relentlessGloryseeker
                );

                this.player1.clickCard(this.relentlessGloryseeker);
                expect(this.relentlessGloryseeker.location).toBe('play area');
                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Relentless Gloryseeker to return to play - Relentless Gloryseeker is ready for more'
                );
            });

            it('returns to play after being discarded by opponent', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.relentlessGloryseeker, this.messageRunner],
                    defenders: [this.chagatai]
                });

                this.player2.clickCard(this.assassinationP2);
                this.player2.clickCard(this.relentlessGloryseeker);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(
                    this.relentlessGloryseeker
                );

                this.player1.clickCard(this.relentlessGloryseeker);
                expect(this.relentlessGloryseeker.location).toBe('play area');
                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Relentless Gloryseeker to return to play - Relentless Gloryseeker is ready for more'
                );
            });

            it('is removed from play after 2nd leave from play', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    element:'void',
                    attackers: [this.relentlessGloryseeker, this.messageRunner],
                    defenders: []
                });

                this.player2.clickCard(this.assassinationP2);
                this.player2.clickCard(this.relentlessGloryseeker);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.relentlessGloryseeker);
                expect(this.relentlessGloryseeker.location).toBe('play area');

                this.player1.clickCard(this.assassinationP1);
                this.player1.clickCard(this.relentlessGloryseeker);

                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.relentlessGloryseeker.location).toBe('removed from game');

                expect(this.getChatLogs(5)).toContain(
                    'Relentless Gloryseeker is removed from the game due to leaving play - may their tales lead them to Yomi'
                );
            });
        });
    });
});

describe('Relentless Gloryseeker outside the conflict phase', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['relentless-gloryseeker']
                }
            });
            this.relentlessGloryseeker = this.player1.findCardByName('relentless-gloryseeker');
        });

        it('does not return after the fate phase discards it', function () {
            this.nextPhase();
            this.player1.clickPrompt('Done');
            expect(this.relentlessGloryseeker.location).toBe('dynasty discard pile');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.game.currentPhase).toBe('fate');
        });
    });
});
