describe('SoD - Scorpion', function () {
    integration(function () {
        describe('Bayushi Rumormonger', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-rumormonger'],
                        hand: [],
                    },
                    player2: {
                        inPlay: ['keeper-initiate', 'doji-diplomat'],
                        hand: ['assassination', 'let-go', 'duelist-training'],
                    }
                });

                this.rumormonger = this.player1.findCardByName('bayushi-rumormonger');
                this.keeper = this.player2.findCardByName('keeper-initiate');
                this.diplomat = this.player2.findCardByName('doji-diplomat');
                this.training = this.player2.findCardByName('duelist-training');

                this.player2.player.moveCard(this.training, 'conflict deck');
            });

            it('should work', function () {
                this.player1.clickCard(this.rumormonger);

                expect(this.player1).toBeAbleToSelect(this.diplomat);
                expect(this.player1).not.toBeAbleToSelect(this.keeper);
                expect(this.getChatLogs(5)).toContain('player1 uses Bayushi Rumormonger to discard the top card of player2\'s conflict deck');

                this.player1.clickCard(this.diplomat);

                expect(this.getChatLogs(5)).toContain('player1 dishonors Doji Diplomat');
            });

            it('should work if no one to bow', function () {
                this.player2.moveCard(this.diplomat, 'dynasty deck');
                this.player1.clickCard(this.rumormonger);
                expect(this.getChatLogs(5)).toContain('player1 uses Bayushi Rumormonger to discard the top card of player2\'s conflict deck');
                expect(this.player2).toHavePrompt('Action Window');
            });
        });

        describe('Bayushi Shinobu', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-shinobu', 'daidoji-uji'],
                        hand: [],
                    },
                    player2: {
                        inPlay: ['keeper-initiate', 'doji-diplomat'],
                        hand: ['assassination', 'let-go', 'duelist-training'],
                    }
                });

                this.shinobu = this.player1.findCardByName('bayushi-shinobu');
                this.keeper = this.player2.findCardByName('keeper-initiate');
                this.diplomat = this.player2.findCardByName('doji-diplomat');
                this.assassination = this.player2.findCardByName('assassination');
                this.uji = this.player1.findCardByName('daidoji-uji');
                this.uji.honor();
                this.keeper.dishonor();
            });

            it('should work', function () {
                this.player1.clickCard(this.shinobu);
                expect(this.player1).toBeAbleToSelect(this.keeper);
                expect(this.player1).not.toBeAbleToSelect(this.diplomat);

                this.player1.clickCard(this.keeper);
                expect(this.getChatLogs(5)).toContain('player1 uses Bayushi Shinobu, bowing Bayushi Shinobu to take control of Keeper Initiate');

                let honor = this.player1.honor;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.keeper],
                    defenders: [this.diplomat]
                });

                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.keeper);

                expect(this.player1.honor).toBe(honor - 3); // 2 from the effect, 1 from the DH token
                expect(this.getChatLogs(5)).toContain('player1 loses 2 honor due to the delayed effect of Bayushi Shinobu');
            });

            it('enters dishonored', function () {
                this.player1.placeCardInProvince(this.shinobu, 'province 1');
                expect(this.shinobu.location).toBe('province 1');
                this.player1.clickCard(this.shinobu);
                this.player1.clickPrompt('0');
                expect(this.shinobu.location).toBe('play area');
                expect(this.shinobu.isDishonored).toBe(true);
            });
        });

        describe('Pressure', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-rumormonger'],
                        hand: ['pressure'],
                    },
                    player2: {
                        inPlay: ['keeper-initiate', 'doji-diplomat'],
                        hand: ['assassination', 'let-go', 'duelist-training', 'favored-mount'],
                    }
                });

                this.mount = this.player2.findCardByName('favored-mount');
                this.pressure = this.player1.findCardByName('pressure');
                this.rumormonger = this.player1.findCardByName('bayushi-rumormonger');
                this.keeper = this.player2.findCardByName('keeper-initiate');
                this.diplomat = this.player2.findCardByName('doji-diplomat');
                this.training = this.player2.findCardByName('duelist-training');

                this.player2.player.moveCard(this.training, 'conflict deck');
            });

            it('should work on defenders', function () {
                this.keeper.dishonor();

                this.player1.pass();
                this.player2.clickCard(this.mount);
                this.player2.clickCard(this.keeper);

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rumormonger],
                    defenders: [this.keeper, this.diplomat]
                });

                expect(this.player1).toBeAbleToSelect(this.pressure);
                this.player1.clickCard(this.pressure);
                expect(this.getChatLogs(5)).toContain('player1 plays Pressure to move a character home and prevent it from participating in the conflict');
                expect(this.getChatLogs(5)).toContain('player1 chooses Keeper Initiate');
                expect(this.keeper.isParticipating()).toBe(false);

                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.mount);
                expect(this.keeper.isParticipating()).toBe(false);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should work on movement', function () {
                this.keeper.dishonor();

                this.player1.pass();
                this.player2.clickCard(this.mount);
                this.player2.clickCard(this.keeper);

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rumormonger],
                    defenders: [this.diplomat]
                });

                this.diplomat.dishonor();
                this.player2.clickCard(this.mount);

                expect(this.player1).toBeAbleToSelect(this.pressure);
                this.player1.clickCard(this.pressure);
                expect(this.keeper.isParticipating()).toBe(false);
            });

            it('should work on attackers', function () {
                this.keeper.dishonor();
                this.diplomat.dishonor();

                this.player1.pass();
                this.player2.clickCard(this.mount);
                this.player2.clickCard(this.keeper);

                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.keeper, this.diplomat],
                });

                expect(this.player1).toBeAbleToSelect(this.pressure);
                this.player1.clickCard(this.pressure);
                expect(this.player1).toBeAbleToSelect(this.keeper);
                expect(this.player1).toBeAbleToSelect(this.diplomat);

                this.player1.clickCard(this.diplomat);
                expect(this.diplomat.isParticipating()).toBe(false);
            });
        });

        describe('Disputed Lineage', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-rumormonger'],
                        hand: ['disputed-lineage'],
                    },
                    player2: {
                        inPlay: ['keeper-initiate', 'doji-diplomat'],
                        hand: ['assassination', 'let-go', 'duelist-training', 'favored-mount'],
                    }
                });

                this.lineage = this.player1.findCardByName('disputed-lineage');
                this.rumormonger = this.player1.findCardByName('bayushi-rumormonger');
                this.keeper = this.player2.findCardByName('keeper-initiate');
                this.diplomat = this.player2.findCardByName('doji-diplomat');
                this.training = this.player2.findCardByName('duelist-training');
            });

            it('should work on defenders', function () {
                this.player1.clickCard(this.lineage);
                this.player1.clickCard(this.keeper);

                let hand = this.player2.hand.length;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rumormonger],
                    defenders: [this.keeper, this.diplomat]
                });

                expect(this.player2.hand.length).toBe(hand - 1);
                expect(this.getChatLogs(5)).toContain('player2 discards a card at random due to the delayed effect of Disputed Lineage');
            });

            it('should work on defenders', function () {
                this.player1.clickCard(this.lineage);
                this.player1.clickCard(this.keeper);

                let hand = this.player2.hand.length;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rumormonger],
                    defenders: [this.diplomat]
                });

                expect(this.player2.hand.length).toBe(hand);
            });

            it('should work on attackers', function () {
                this.player1.clickCard(this.lineage);
                this.player1.clickCard(this.keeper);

                let hand = this.player2.hand.length;

                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.keeper, this.diplomat],
                    defenders: [],
                });


                expect(this.player2.hand.length).toBe(hand - 1);
                expect(this.getChatLogs(5)).toContain('player2 discards a card at random due to the delayed effect of Disputed Lineage');
            });

            it('should only work once per round', function () {
                this.player1.clickCard(this.lineage);
                this.player1.clickCard(this.keeper);

                let hand = this.player2.hand.length;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rumormonger],
                    defenders: [this.keeper, this.diplomat]
                });

                expect(this.player2.hand.length).toBe(hand - 1);

                this.rumormonger.bow();
                this.noMoreActions();
                this.keeper.ready();
                this.noMoreActions();

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.keeper],
                    defenders: [],
                    ring: 'fire'
                });

                expect(this.player2.hand.length).toBe(hand - 1);
            });
        });

        describe('Soshi Aya', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-rumormonger', 'border-rider', 'doji-diplomat'],
                        hand: ['command-the-tributary'],
                    },
                    player2: {
                        inPlay: ['keeper-initiate'],
                        hand: ['soshi-aya', 'let-go', 'duelist-training'],
                    }
                });

                this.rumormonger = this.player1.findCardByName('bayushi-rumormonger');
                this.rider = this.player1.findCardByName('border-rider');
                this.keeper = this.player2.findCardByName('keeper-initiate');
                this.diplomat = this.player1.findCardByName('doji-diplomat');
                this.training = this.player2.findCardByName('duelist-training');
                this.aya = this.player2.findCardByName('soshi-aya');
                this.tributary = this.player1.findCardByName('command-the-tributary');
                this.player2.player.moveCard(this.training, 'conflict deck');
                this.diplomat.fate = 5;
                this.rider.bow();
                this.player1.playAttachment(this.tributary, this.diplomat);
                this.player2.pass();
            });

            it('should work', function () {
                this.player1.clickCard(this.rumormonger);

                expect(this.player2).toBeAbleToSelect(this.aya);
                this.player2.clickCard(this.aya);
                expect(this.getChatLogs(5)).toContain('player1 uses Bayushi Rumormonger to discard the top card of player2\'s conflict deck');
                expect(this.getChatLogs(5)).toContain('player2 uses Soshi Aya, putting Soshi Aya into play to cancel the effects of Bayushi Rumormonger');
                expect(this.aya.location).toBe('play area');
                expect(this.aya.fate).toBe(1);
            });

            it('non-courtier', function () {
                expect(this.rider.bowed).toBe(true);
                this.player1.clickCard(this.rider);
                expect(this.rider.bowed).toBe(false);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('gained ability', function () {
                expect(this.diplomat.fate).toBe(5);
                this.player1.clickCard(this.diplomat);
                this.player1.clickCard(this.rider);
                expect(this.diplomat.fate).toBe(4);
                expect(this.player2).toHavePrompt('Action Window');
            });
        });

        describe('We Know', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-rumormonger'],
                        hand: ['we-know'],
                    },
                    player2: {
                        inPlay: ['keeper-initiate', 'doji-diplomat', 'brash-samurai', 'doji-challenger'],
                        hand: ['assassination', 'let-go', 'duelist-training'],
                    }
                });

                this.weknow = this.player1.findCardByName('we-know');
                this.rumormonger = this.player1.findCardByName('bayushi-rumormonger');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.keeper = this.player2.findCardByName('keeper-initiate');
                this.diplomat = this.player2.findCardByName('doji-diplomat');
                this.brash = this.player2.findCardByName('brash-samurai');

                this.challenger.taint();
                this.keeper.dishonor();
                this.diplomat.honor();
                this.brash.honor();
                this.rumormonger.honor();
            });

            it('dishonor', function () {
                this.player1.clickCard(this.weknow);
                expect(this.player1).toBeAbleToSelect(this.rumormonger);
                this.player1.clickCard(this.rumormonger);

                let honor1 = this.player1.honor;
                let honor2 = this.player2.honor;

                expect(this.player1).not.toBeAbleToSelect(this.challenger);
                expect(this.player1).not.toBeAbleToSelect(this.keeper);
                expect(this.player1).toBeAbleToSelect(this.diplomat);
                expect(this.player1).toBeAbleToSelect(this.brash);
                expect(this.player1).not.toBeAbleToSelect(this.rumormonger);

                this.player1.clickCard(this.brash);

                expect(this.player2).toHavePromptButton('Dishonor Brash Samurai');
                expect(this.player2).toHavePromptButton('Lose honor and let opponent draw cards');

                expect(this.brash.isHonored).toBe(true);
                expect(this.brash.isDishonored).toBe(false);
                this.player2.clickPrompt('Dishonor Brash Samurai');
                expect(this.brash.isHonored).toBe(false);
                expect(this.brash.isDishonored).toBe(true);

                expect(this.player1.honor).toBe(honor1);
                expect(this.player2.honor).toBe(honor2);

                expect(this.getChatLogs(5)).toContain('player1 plays We Know, bowing Bayushi Rumormonger to replace Brash Samurai honored status token with a dishonored status token');
                expect(this.getChatLogs(5)).not.toContain('player1 loses 2 honor');
            });

            it('lose honor', function () {
                let hand1 = this.player1.hand.length;
                this.player1.clickCard(this.weknow);
                expect(this.player1).toBeAbleToSelect(this.rumormonger);
                this.player1.clickCard(this.rumormonger);

                expect(this.player1).not.toBeAbleToSelect(this.challenger);
                expect(this.player1).not.toBeAbleToSelect(this.keeper);
                expect(this.player1).toBeAbleToSelect(this.diplomat);
                expect(this.player1).toBeAbleToSelect(this.brash);
                expect(this.player1).not.toBeAbleToSelect(this.rumormonger);

                this.player1.clickCard(this.brash);

                expect(this.player2).toHavePromptButton('Dishonor Brash Samurai');
                expect(this.player2).toHavePromptButton('Lose honor and let opponent draw cards');

                let honor1 = this.player1.honor;
                let honor2 = this.player2.honor;
                let hand2 = this.player2.hand.length;
                this.player2.clickPrompt('Lose honor and let opponent draw cards');

                expect(this.player1.honor).toBe(honor1 - 2);
                expect(this.player2.honor).toBe(honor2 - 1);
                expect(this.player1.hand.length).toBe(hand1 + 1); //draw 2
                expect(this.player2.hand.length).toBe(hand2);

                expect(this.getChatLogs(5)).toContain('player1 plays We Know, bowing Bayushi Rumormonger to draw two cards and cause player2 to lose 1 honor');
                expect(this.getChatLogs(5)).toContain('player1 loses 2 honor');
            });
        });

        describe('Kiss of the Sea', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-yunako'],
                        hand: ['kiss-of-the-sea', 'compelling-testimony', 'assassination', 'fine-katana', 'let-go', 'way-of-the-scorpion'],
                    },
                    player2: {
                        inPlay: ['brash-samurai', 'keeper-initiate'],
                        hand: ['a-perfect-cut', 'defiance', 'kakita-technique', 'subdue-the-spirits'],
                    }
                });

                this.player2.honor = 20;

                this.yunako = this.player1.findCardByName('bayushi-yunako');
                this.brash = this.player2.findCardByName('brash-samurai');
                this.keeper = this.player2.findCardByName('keeper-initiate');

                this.way = this.player1.findCardByName('way-of-the-scorpion');
                this.sea = this.player1.findCardByName('kiss-of-the-sea');
                this.katana = this.player1.findCardByName('fine-katana');
                this.testimony = this.player1.findCardByName('compelling-testimony');
                this.cut = this.player2.findCardByName('a-perfect-cut');
                this.defiance = this.player2.findCardByName('defiance');
                this.technique = this.player2.findCardByName('kakita-technique');
                this.subdue = this.player2.findCardByName('subdue-the-spirits');

                this.player1.playAttachment(this.sea, this.brash);
            });

            it('mil buff', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yunako],
                    defenders: [this.brash],
                });

                this.player2.clickCard(this.cut);
                this.player2.clickCard(this.brash);

                expect(this.player1).toBeAbleToSelect(this.sea);
                this.player1.clickCard(this.sea);
                expect(this.brash.bowed).toBe(true);
                expect(this.getChatLogs(5)).toContain('player1 uses Kiss of the Sea to bow Brash Samurai');
            });

            it('multi character buff', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yunako],
                    defenders: [this.brash, this.keeper],
                });

                this.player2.clickCard(this.subdue);

                expect(this.player1).toBeAbleToSelect(this.sea);
                this.player1.clickCard(this.sea);
                expect(this.brash.bowed).toBe(true);
                expect(this.getChatLogs(5)).toContain('player1 uses Kiss of the Sea to bow Brash Samurai');
            });

            it('pol debuff', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.yunako],
                    defenders: [this.brash],
                });

                this.player2.pass();
                this.player1.clickCard(this.testimony);
                this.player1.clickCard(this.brash);

                expect(this.player1).toBeAbleToSelect(this.sea);
                this.player1.clickCard(this.sea);
                expect(this.brash.bowed).toBe(true);
                expect(this.getChatLogs(5)).toContain('player1 uses Kiss of the Sea to bow Brash Samurai');
            });

            it('pol debuff on other character', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.yunako],
                    defenders: [this.brash, this.keeper],
                });

                this.player2.pass();
                this.player1.clickCard(this.testimony);
                this.player1.clickCard(this.keeper);

                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('both buff', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.yunako],
                    defenders: [this.brash],
                });

                this.player2.clickCard(this.defiance);
                this.player2.clickCard(this.brash);

                expect(this.player1).toBeAbleToSelect(this.sea);
                this.player1.clickCard(this.sea);
                expect(this.brash.bowed).toBe(true);
                expect(this.getChatLogs(5)).toContain('player1 uses Kiss of the Sea to bow Brash Samurai');
            });

            it('switch', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.yunako],
                    defenders: [this.brash],
                });

                this.player2.pass();

                this.player1.clickCard(this.yunako);
                this.player1.clickCard(this.brash);

                expect(this.player1).toBeAbleToSelect(this.sea);
                this.player1.clickCard(this.sea);
                expect(this.brash.bowed).toBe(true);
                expect(this.getChatLogs(5)).toContain('player1 uses Kiss of the Sea to bow Brash Samurai');
            });

            it('honor', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.yunako],
                    defenders: [this.brash],
                });

                this.player2.clickCard(this.brash);

                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('attachment', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yunako],
                    defenders: [this.brash],
                });

                this.player2.pass();
                this.player1.playAttachment(this.katana, this.brash);

                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('delayed effect', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.yunako],
                    defenders: [this.brash],
                });

                this.player2.clickCard(this.technique);
                this.player2.clickCard(this.brash);

                expect(this.player1).toBeAbleToSelect(this.sea);
                this.player1.clickCard(this.sea);
                expect(this.brash.bowed).toBe(true);
                expect(this.getChatLogs(5)).toContain('player1 uses Kiss of the Sea to bow Brash Samurai');
            });
        });
    });
});