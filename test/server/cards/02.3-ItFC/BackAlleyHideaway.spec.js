describe('Back-Alley Hideaway', function() {
    integration(function() {
        function assassinate(player, target) {
            player.clickCard('assassination');
            expect(player).toHavePromptButton('Pay costs first');
            player.clickPrompt('Pay costs first');
            player.clickCard(target);
        }

        describe('Place character in Hideaway interrupt', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kakita-yoshi'],
                        hand: ['assassination']
                    },
                    player2: {
                        inPlay: ['bayushi-manipulator', 'miya-mystic'],
                        dynastyDiscard: ['back-alley-hideaway']
                    }
                });

                this.yoshi = this.player1.findCardByName('kakita-yoshi');
                this.assassination = this.player1.findCardByName('assassination');
                this.manipulator = this.player2.findCardByName('bayushi-manipulator');
                this.mystic = this.player2.findCardByName('miya-mystic');
                this.backAlley = this.player2.placeCardInProvince('back-alley-hideaway', 'province 1');

                this.player1.player.honor = 10;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yoshi],
                    defenders: []
                });
                this.player2.pass();
            });

            it('stores a Scorpion character you control under the holding when it leaves play', function() {
                assassinate(this.player1, this.manipulator);
                this.player2.clickCard(this.backAlley);

                expect(this.manipulator.location).not.toBe('dynasty discard pile');
                expect(this.manipulator.location).not.toBe('play area');
                expect(this.manipulator.parent).toBe(this.backAlley);
                expect(this.backAlley.attachments).toContain(this.manipulator);
                expect(this.manipulator.abilities.playActions.some(
                    (action) => action.title === 'Play a character from hiding'
                )).toBe(true);
            });

            it('sends the character to the discard pile if the interrupt is declined', function() {
                assassinate(this.player1, this.manipulator);
                expect(this.player2).toHavePrompt('Any interrupts to Bayushi Manipulator leaving play?');
                this.player2.clickPrompt('Pass');

                expect(this.manipulator.location).toBe('dynasty discard pile');
                expect(this.manipulator.parent).toBeFalsy();
                expect(this.backAlley.attachments).not.toContain(this.manipulator);
            });

            it('does not trigger for a non-Scorpion character', function() {
                assassinate(this.player1, this.mystic);

                expect(this.mystic.location).toBe('dynasty discard pile');
                expect(this.mystic.parent).toBeFalsy();
                expect(this.backAlley.attachments).not.toContain(this.mystic);
            });
        });

        describe('a character with Sincerity hidden in the Hideaway', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kakita-yoshi'],
                        hand: ['assassination']
                    },
                    player2: {
                        inPlay: ['bayushi-liar'],
                        dynastyDiscard: ['back-alley-hideaway'],
                        conflictDeck: ['fine-katana', 'ornate-fan']
                    }
                });

                this.yoshi = this.player1.findCardByName('kakita-yoshi');
                this.liar = this.player2.findCardByName('bayushi-liar');
                this.backAlley = this.player2.placeCardInProvince('back-alley-hideaway', 'province 1');
                this.player1.player.honor = 10;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yoshi],
                    defenders: []
                });
                this.player2.pass();
            });

            it('still resolves Sincerity, as the character leaves play (EmeraldDB ruling)', function() {
                const handSize = this.player2.hand.length;
                assassinate(this.player1, this.liar);
                this.player2.clickCard(this.backAlley);

                expect(this.liar.parent).toBe(this.backAlley);
                expect(this.player2.hand.length).toBe(handSize + 1);
                expect(this.getChatLogs(5)).toContain('player2 draws a card due to Bayushi Liar\'s Sincerity');
            });
        });

        describe('Play this character from Back-Alley Hideaway action', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kakita-yoshi'],
                        hand: ['assassination']
                    },
                    player2: {
                        inPlay: ['bayushi-manipulator'],
                        fate: 10,
                        dynastyDiscard: ['back-alley-hideaway']
                    }
                });

                this.yoshi = this.player1.findCardByName('kakita-yoshi');
                this.assassination = this.player1.findCardByName('assassination');
                this.manipulator = this.player2.findCardByName('bayushi-manipulator');
                this.backAlley = this.player2.placeCardInProvince('back-alley-hideaway', 'province 1');

                this.player1.player.honor = 10;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yoshi],
                    defenders: []
                });
                this.player2.pass();
                assassinate(this.player1, this.manipulator);
                this.player2.clickCard(this.backAlley);
            });

            it('cannot be played outside of the Dynasty phase', function() {
                expect(this.game.currentPhase).toBe('conflict');
                this.player2.clickCard(this.manipulator);
                expect(this.manipulator.isUnderneath(this.backAlley)).toBe(true);
                expect(this.manipulator.parent).toBe(this.backAlley);
            });

            it('plays the stored character into play and sacrifices the holding', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t resolve');
                this.advancePhases('fate');
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');
                expect(this.game.currentPhase).toBe('dynasty');

                this.player2.clickCard(this.manipulator);
                this.player2.clickCard(this.manipulator);
                this.player2.clickPrompt('0');

                expect(this.manipulator.location).toBe('play area');
                expect(this.backAlley.location).toBe('dynasty discard pile');
                expect(this.manipulator.parent).toBeFalsy();
                expect(this.manipulator.abilities.playActions.some(
                    (action) => action.title === 'Play a character from hiding'
                )).toBe(false);
            });
        });

        describe('a Disguised character in the Hideaway', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kakita-yoshi']
                    },
                    player2: {
                        fate: 10,
                        inPlay: ['shosuro-ibuki', 'bayushi-manipulator'],
                        hand: ['noble-sacrifice'],
                        dynastyDiscard: ['back-alley-hideaway'],
                        provinces: ['toshi-ranbo']
                    }
                });
                this.yoshi = this.player1.findCardByName('kakita-yoshi');
                this.ibuki = this.player2.findCardByName('shosuro-ibuki');
                this.manipulator = this.player2.findCardByName('bayushi-manipulator');
                this.backAlley = this.player2.placeCardInProvince('back-alley-hideaway', 'province 1');
                this.ibuki.honor();
                this.yoshi.dishonor();
                this.player1.pass();
                this.player2.clickCard('noble-sacrifice');
                this.player2.clickCard(this.yoshi);
                this.player2.clickCard(this.ibuki);
                this.player2.clickCard(this.backAlley);
                expect(this.ibuki.parent).toBe(this.backAlley);
            });

            it('can be played using Disguised in the conflict phase (EmeraldDB ruling)', function() {
                this.player1.pass();
                this.player2.clickCard(this.ibuki);
                this.player2.clickCard(this.ibuki);
                this.player2.clickCard(this.manipulator);
                expect(this.ibuki.location).toBe('play area');
                expect(this.manipulator.location).toBe('dynasty discard pile');
                expect(this.backAlley.location).toBe('dynasty discard pile');
                expect(this.ibuki.parent).toBeFalsy();
            });

            it('stays in play when the play is cancelled', function() {
                this.advancePhases('fate');
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');
                expect(this.game.currentPhase).toBe('dynasty');
                this.player2.clickCard(this.ibuki);
                this.player2.clickCard(this.ibuki);
                this.player2.clickPrompt('Cancel');
                expect(this.ibuki.parent).toBe(this.backAlley);
                expect(this.backAlley.location).toBe('province 1');
            });

            it('gets Toshi Ranbo\'s extra fate when played in the dynasty phase (EmeraldDB ruling)', function() {
                this.advancePhases('fate');
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');
                expect(this.game.currentPhase).toBe('dynasty');
                this.player2.clickCard(this.ibuki);
                this.player2.clickCard(this.ibuki);
                this.player2.clickPrompt('0');
                expect(this.ibuki.location).toBe('play area');
                expect(this.ibuki.fate).toBe(1);
            });
        });

        describe('when a character returns to hand', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-shadows'],
                        dynastyDiscard: ['back-alley-hideaway']
                    }
                });
                this.adept = this.player1.findCardByName('adept-of-shadows');
                this.backAlley = this.player1.placeCardInProvince('back-alley-hideaway', 'province 1');
            });

            it('isn\'t offered, as the character doesn\'t go to the discard pile', function() {
                this.player1.clickCard(this.adept);
                expect(this.player1).not.toHavePrompt('Any interrupts to Adept of Shadows leaving play?');
                expect(this.adept.location).toBe('hand');
                expect(this.backAlley.attachments.length).toBe(0);
            });
        });
    });
});
