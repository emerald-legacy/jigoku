describe('Illustrious Plagiarist', function() {
    integration(function() {
        describe('When copying A Fate Worse Than Death', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 0,
                        inPlay: ['bayushi-shoju', 'illustrious-plagiarist']
                    },
                    player2: {
                        inPlay: ['doji-challenger'],
                        hand: ['a-fate-worse-than-death']
                    }
                });
                this.bayushiShoju = this.player1.findCardByName('bayushi-shoju');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.bayushiShoju],
                    defenders: [this.dojiChallenger]
                });
                this.aFateWorseThanDeath = this.player2.clickCard('a-fate-worse-than-death');
                this.player2.clickCard(this.bayushiShoju);
            });

            it('should allow plagiarist to copy AFWTD', function() {
                expect(this.bayushiShoju.isDishonored).toBe(true);
                expect(this.bayushiShoju.bowed).toBe(true);
                this.illustriousPlagiarist = this.player1.clickCard('illustrious-plagiarist');
                this.player1.clickCard(this.aFateWorseThanDeath);
                this.player2.pass();
                this.player1.clickCard(this.illustriousPlagiarist);
                expect(this.player1).toHavePrompt('Illustrious Plagiarist');
                expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                this.player1.clickCard(this.dojiChallenger);
                expect(this.getChatLogs(3)).toContain('player1 uses Illustrious Plagiarist\'s gained ability from A Fate Worse Than Death to bow, dishonor, blank, move home, and remove a fate from Doji Challenger');
                expect(this.dojiChallenger.isDishonored).toBe(true);
                expect(this.dojiChallenger.bowed).toBe(true);
            });
        });

        describe('When copying A Fate Worse Than Death 2', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 0,
                        inPlay: ['bayushi-shoju', 'illustrious-plagiarist']
                    },
                    player2: {
                        inPlay: ['doji-challenger'],
                        hand: ['a-fate-worse-than-death-2']
                    }
                });
                this.bayushiShoju = this.player1.findCardByName('bayushi-shoju');
                this.illustriousPlagiarist = this.player1.findCardByName('illustrious-plagiarist');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.copyAfwtd2 = (attackers) => {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: attackers,
                        defenders: [this.dojiChallenger]
                    });
                    this.aFateWorseThanDeath2 = this.player2.clickCard('a-fate-worse-than-death-2');
                    this.player2.clickCard(this.bayushiShoju);
                    this.player1.clickCard(this.illustriousPlagiarist);
                    this.player1.clickCard(this.aFateWorseThanDeath2);
                    this.player2.pass();
                };
            });

            it('should allow a participating plagiarist to copy it', function() {
                this.copyAfwtd2([this.bayushiShoju, this.illustriousPlagiarist]);
                this.player1.clickCard(this.illustriousPlagiarist);
                expect(this.player1).toHavePrompt('Illustrious Plagiarist');
                expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
            });

            it('should not let a plagiarist at home use the copied conflict action', function() {
                this.copyAfwtd2([this.bayushiShoju]);
                this.player1.clickCard(this.illustriousPlagiarist);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.dojiChallenger.isDishonored).toBe(false);
            });
        });

        describe('When copying Assassinate', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 1,
                        honor: 10,
                        inPlay: ['bayushi-liar', 'illustrious-plagiarist'],
                        hand: ['cloud-the-mind']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        hand: ['assassination', 'banzai']
                    }
                });
                this.bayushiLiar = this.player1.findCardByName('bayushi-liar');
                this.illustriousPlagiarist = this.player1.findCardByName('illustrious-plagiarist');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.copyAssassination = (attackers) => {
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'political',
                        attackers: attackers,
                        defenders: [this.dojiWhisperer]
                    });
                    this.assassination = this.player2.clickCard('assassination');
                    this.player2.clickCard(this.bayushiLiar);
                    expect(this.bayushiLiar.location).toBe('dynasty discard pile');
                    this.player1.playAttachment('cloud-the-mind', this.dojiWhisperer);
                    this.player2.pass();
                    this.player1.clickCard(this.illustriousPlagiarist);
                    this.player1.clickCard(this.assassination);
                    this.player2.clickCard('banzai');
                    this.player2.clickCard(this.dojiWhisperer);
                    this.player2.clickPrompt('Done');
                };
            });

            it('should allow plagiarist to copy Assassinate', function() {
                this.copyAssassination([this.bayushiLiar, this.illustriousPlagiarist]);
                this.player1.clickCard(this.illustriousPlagiarist);
                expect(this.player1).toHavePrompt('Illustrious Plagiarist');
                expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.dojiWhisperer.location).toBe('dynasty discard pile');
                expect(this.player1.honor).toBe(7);
            });

            it('should not let a plagiarist at home use the copied conflict action', function() {
                this.copyAssassination([this.bayushiLiar]);
                this.player1.clickCard(this.illustriousPlagiarist);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.dojiWhisperer.location).toBe('play area');
                expect(this.player1.honor).toBe(10);
            });
        });

        describe('When copying Blackmail', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 15,
                        inPlay: ['illustrious-plagiarist']
                    },
                    player2: {
                        honor: 5,
                        inPlay: ['doji-whisperer'],
                        conflictDiscard: ['blackmail']
                    }
                });
                this.illustriousPlagiarist = this.player1.findCardByName('illustrious-plagiarist');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.blackmail = this.player2.findCardByName('blackmail', 'conflict discard pile');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.illustriousPlagiarist],
                    defenders: [this.dojiWhisperer]
                });
                this.player2.pass();
                this.player1.clickCard(this.illustriousPlagiarist);
                this.player1.clickCard(this.blackmail);
                this.player2.pass();
            });

            // ruling #210: "Play only if" printed outside the Action ability isn't gained
            it('can use the copied ability without meeting Blackmail\'s play restriction', function() {
                expect(this.player1.player.isLessHonorable()).toBe(false);
                this.player1.clickCard(this.illustriousPlagiarist);
                expect(this.player1).toHavePrompt('Illustrious Plagiarist');
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.dojiWhisperer.controller).toBe(this.player1.player);
            });
        });

        describe('When two Plagiarists copy Banzai!', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['illustrious-plagiarist', 'illustrious-plagiarist'],
                        hand: ['banzai']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        conflictDiscard: ['banzai']
                    }
                });
                [this.plagiarist1, this.plagiarist2] = this.player1.filterCardsByName('illustrious-plagiarist');
                this.ownBanzai = this.player1.findCardByName('banzai', 'hand');
                this.theirBanzai = this.player2.findCardByName('banzai', 'conflict discard pile');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.plagiarist1, this.plagiarist2],
                    defenders: [this.dojiWhisperer]
                });
                this.player2.pass();
                this.player1.clickCard(this.plagiarist1);
                this.player1.clickCard(this.theirBanzai);
                this.player2.pass();
                this.player1.clickCard(this.plagiarist2);
                this.player1.clickCard(this.theirBanzai);
                this.player2.pass();
            });

            // ruling #212: maximums are per ability per card title per player
            it('can use only one of the copies in a conflict', function() {
                this.player1.clickCard(this.plagiarist1);
                this.player1.clickCard(this.plagiarist1);
                this.player1.clickPrompt('Done');
                expect(this.plagiarist1.militarySkill).toBe(3);
                this.player2.pass();
                this.player1.clickCard(this.plagiarist2);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.plagiarist2.militarySkill).toBe(1);
            });

            // ruling #212: your own Banzai! and one copy are fine
            it('can use a copy after playing your own Banzai!', function() {
                this.player1.clickCard(this.ownBanzai);
                this.player1.clickCard(this.plagiarist2);
                this.player1.clickPrompt('Done');
                expect(this.plagiarist2.militarySkill).toBe(3);
                this.player2.pass();
                this.player1.clickCard(this.plagiarist1);
                expect(this.player1).toHavePrompt('Illustrious Plagiarist');
                this.player1.clickCard(this.plagiarist1);
                this.player1.clickPrompt('Done');
                expect(this.plagiarist1.militarySkill).toBe(3);
            });
        });

        describe('When an older event is under the topmost event', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['illustrious-plagiarist']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        conflictDiscard: ['banzai', 'a-fate-worse-than-death']
                    }
                });
                this.illustriousPlagiarist = this.player1.findCardByName('illustrious-plagiarist');
                this.banzai = this.player2.findCardByName('banzai', 'conflict discard pile');
            });

            it('should only allow choosing the topmost event', function() {
                this.aFateWorseThanDeath = this.player2.findCardByName('a-fate-worse-than-death', 'conflict discard pile');
                this.player1.clickCard(this.illustriousPlagiarist);
                expect(this.player1).toHavePrompt('Illustrious Plagiarist');
                expect(this.player1).toBeAbleToSelect(this.banzai);
                expect(this.player1).not.toBeAbleToSelect(this.aFateWorseThanDeath);
            });
        });

        describe('When the topmost event has no action ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['illustrious-plagiarist']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        conflictDiscard: ['voice-of-honor', 'banzai']
                    }
                });
                this.illustriousPlagiarist = this.player1.findCardByName('illustrious-plagiarist');
                this.banzai = this.player2.findCardByName('banzai', 'conflict discard pile');
            });

            it('should not be able to trigger', function() {
                this.player1.clickCard(this.illustriousPlagiarist);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });

        describe('When a non-event card is on top of the topmost event', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['illustrious-plagiarist']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        conflictDiscard: ['fine-katana', 'banzai']
                    }
                });
                this.illustriousPlagiarist = this.player1.findCardByName('illustrious-plagiarist');
                this.banzai = this.player2.findCardByName('banzai', 'conflict discard pile');
            });

            it('should allow choosing the topmost event', function() {
                this.fineKatana = this.player2.findCardByName('fine-katana', 'conflict discard pile');
                this.player1.clickCard(this.illustriousPlagiarist);
                expect(this.player1).toHavePrompt('Illustrious Plagiarist');
                expect(this.player1).toBeAbleToSelect(this.banzai);
                expect(this.player1).not.toBeAbleToSelect(this.fineKatana);
            });
        });
    });
});
