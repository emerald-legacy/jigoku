describe('Back-Alley Hideaway', function() {
    integration(function() {
        function assassinate(player, target) {
            player.clickCard('assassination');
            if(player.currentButtons.includes('Pay costs first')) {
                player.clickPrompt('Pay costs first');
            }
            player.clickCard(target);
        }

        function advanceToDynasty(flow) {
            let guard = 0;
            while(flow.game.currentPhase !== 'dynasty' && guard++ < 80) {
                let acted = false;
                for(const p of [flow.player1, flow.player2]) {
                    if(flow.game.currentPhase === 'dynasty') {
                        break;
                    }
                    const menuTitle = p.currentPrompt().menuTitle;
                    const buttons = p.currentButtons;
                    if(menuTitle === 'Choose an effect to resolve') {
                        p.clickPrompt('Don\'t resolve');
                        acted = true;
                    } else if(buttons.includes('Pass')) {
                        p.clickPrompt('Pass');
                        acted = true;
                    } else if(buttons.includes('Pass Conflict')) {
                        p.clickPrompt('Pass Conflict');
                        if(p.currentButtons.includes('Yes')) {
                            p.clickPrompt('Yes');
                        }
                        acted = true;
                    } else if(buttons.includes('Done')) {
                        p.clickPrompt('Done');
                        acted = true;
                    } else if(buttons.includes('End Round')) {
                        p.clickPrompt('End Round');
                        acted = true;
                    } else if(menuTitle && menuTitle.indexOf('Imperial Favor') >= 0 && !menuTitle.startsWith('Waiting')) {
                        p.clickPrompt('military');
                        acted = true;
                    } else if(buttons.length === 1 && buttons[0]) {
                        p.clickPrompt(buttons[0]);
                        acted = true;
                    }
                }
                if(!acted) {
                    break;
                }
            }
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
                expect(this.manipulator.location).toBe(this.backAlley.uuid);
                expect(this.manipulator.parent).toBe(this.backAlley);
            });

            it('plays the stored character into play and sacrifices the holding', function() {
                advanceToDynasty(this.flow);
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

            it('gets Toshi Ranbo\'s extra fate when played in the dynasty phase (EmeraldDB ruling)', function() {
                advanceToDynasty(this.flow);
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
