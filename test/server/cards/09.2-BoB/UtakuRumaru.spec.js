describe('Utaku Rumaru', function() {
    integration(function() {
        describe('Utaku Rumaru\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['utaku-rumaru', 'adept-of-the-waves', 'solemn-scholar'],
                        hand: ['fine-katana']
                    },
                    player2: {
                        inPlay: ['shinjo-outrider','shinjo-scout']
                    }
                });
                this.rumaru = this.player1.findCardByName('utaku-rumaru');
                this.adept = this.player1.findCardByName('adept-of-the-waves');
                this.katana = this.player1.findCardByName('fine-katana');
                this.scholar = this.player1.findCardByName('solemn-scholar');

                this.outrider = this.player2.findCardByName('shinjo-outrider');
                this.scout = this.player2.findCardByName('shinjo-scout');
            });

            it('static ability should increase the glory of your honored characters', function() {
                this.adept.honor();
                this.game.checkGameState(true);
                expect(this.adept.glory).toBe(3);
            });

            it('static ability should decrease glory for dishonored characters', function() {
                this.rumaru.dishonor();
                this.game.checkGameState(true);
                expect(this.rumaru.glory).toBe(2);
            });

            it('should not effect opponent characters glory', function() {
                this.outrider.honor();
                this.game.checkGameState(true);
                expect(this.outrider.glory).toBe(2);
            });

            it('should trigger after she wins a conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.rumaru, this.adept],
                    defenders: [this.outrider]
                });
                this.noMoreActions();
                expect(this.player1).toBeAbleToSelect(this.rumaru);
            });

            it('should allow you to honor another pariticipating character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.rumaru, this.adept],
                    defenders: [this.outrider]
                });
                this.noMoreActions();
                this.player1.clickCard(this.rumaru);
                expect(this.player1).toBeAbleToSelect(this.adept);
            });

            it('should honor the chosen character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.rumaru, this.adept],
                    defenders: [this.outrider]
                });
                this.noMoreActions();
                this.player1.clickCard(this.rumaru);
                this.player1.clickCard(this.adept);
                expect(this.player1).toHavePrompt('Select card to discard');
                this.player1.clickCard(this.katana);
                expect(this.adept.isHonored).toBe(true);
                expect(this.katana.location).toBe('conflict discard pile');
            });

            it('should not let her honor herself', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.rumaru, this.adept],
                    defenders: [this.outrider]
                });
                this.noMoreActions();
                this.player1.clickCard(this.rumaru);
                expect(this.player1).not.toBeAbleToSelect(this.rumaru);
            });

            it('should not let you honor characters at home', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.rumaru, this.adept],
                    defenders: [this.outrider]
                });
                this.noMoreActions();
                this.player1.clickCard(this.rumaru);
                expect(this.player1).not.toBeAbleToSelect(this.scholar);
            });

            it('should let you honor your opponent characters', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.rumaru, this.adept],
                    defenders: [this.outrider]
                });
                this.noMoreActions();
                this.player1.clickCard(this.rumaru);
                expect(this.player1).toBeAbleToSelect(this.outrider);
            });
        });
    });
});

describe('Utaku Rumaru on the other side (Join the Fray)', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['adept-of-the-waves', 'matsu-berserker'],
                    dynastyDeck: ['utaku-rumaru'],
                    hand: ['join-the-fray', 'fine-katana']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.adept = this.player1.findCardByName('adept-of-the-waves');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.rumaru = this.player1.placeCardInProvince('utaku-rumaru', 'province 1');
            this.rumaru.facedown = false;
            this.fray = this.player1.findCardByName('join-the-fray');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('wins when the side it is on wins, although its controller loses', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.adept],
                defenders: [],
                type: 'military'
            });
            this.player2.pass();
            this.player1.clickCard(this.fray);
            this.player1.clickCard(this.rumaru);
            this.player1.clickPrompt('player2');
            expect(this.game.currentConflict.defenders).toContain(this.rumaru);

            this.noMoreActions();
            expect(this.game.currentConflict.winner).toBe(this.player2.player);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.rumaru);
        });

        it('does not win when its controller wins on the other side', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.adept, this.berserker],
                defenders: [],
                type: 'military'
            });
            this.player2.pass();
            this.player1.clickCard(this.fray);
            this.player1.clickCard(this.rumaru);
            this.player1.clickPrompt('player2');

            this.noMoreActions();
            expect(this.game.currentConflict.winner).toBe(this.player1.player);
            expect(this.player1).not.toBeAbleToSelect(this.rumaru);
        });
    });
});
