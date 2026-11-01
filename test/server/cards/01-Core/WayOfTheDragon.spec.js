describe('Way of the Dragon', function() {
    integration(function() {
        describe('on characters with limited abilities', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 10,
                        inPlay: [{ card: 'wandering-ronin', fate: 4 }, 'adept-of-the-waves'],
                        hand: ['way-of-the-dragon', 'way-of-the-dragon', 'let-go']
                    },
                    player2: {
                        inPlay: ['shiba-peacemaker', 'doji-whisperer']
                    }
                });
                this.ronin = this.player1.findCardByName('wandering-ronin');
                this.adept = this.player1.findCardByName('adept-of-the-waves', 'play area');
                [this.dragon, this.dragon2] = this.player1.filterCardsByName('way-of-the-dragon', 'hand');
                this.letGo = this.player1.findCardByName('let-go');
                this.peacemaker = this.player2.findCardByName('shiba-peacemaker');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
            });

            it('can only be attached to a character you control', function() {
                this.player1.clickCard(this.dragon);
                expect(this.player1).toBeAbleToSelect(this.ronin);
                expect(this.player1).toBeAbleToSelect(this.adept);
                expect(this.player1).not.toBeAbleToSelect(this.peacemaker);
                expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            });

            it('lets the attached character trigger a once per round ability an additional time', function() {
                this.player1.playAttachment(this.dragon, this.adept);
                this.player2.pass();
                this.player1.clickCard(this.adept);
                expect(this.player1).toHavePrompt('Adept of the Waves');
                this.player1.clickCard(this.ronin);
                this.player2.pass();
                this.player1.clickCard(this.adept);
                expect(this.player1).toHavePrompt('Adept of the Waves');
                this.player1.clickCard(this.adept);
                this.player2.pass();
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.adept);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.player1).not.toHavePrompt('Adept of the Waves');
            });

            it('lets the attached character trigger a limit twice per conflict ability a third time', function() {
                this.player1.playAttachment(this.dragon, this.ronin);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ronin],
                    defenders: [this.peacemaker]
                });
                this.player2.pass();
                this.player1.clickCard(this.ronin);
                this.player2.pass();
                this.player1.clickCard(this.ronin);
                this.player2.pass();
                this.player1.clickCard(this.ronin);
                expect(this.ronin.fate).toBe(1);
                expect(this.ronin.militarySkill).toBe(9);
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.ronin);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.ronin.fate).toBe(1);
                expect(this.ronin.militarySkill).toBe(9);
            });

            it('discards the first copy when a second copy is attached to the same character (ruling #720)', function() {
                this.player1.playAttachment(this.dragon, this.ronin);
                this.player2.pass();
                this.player1.playAttachment(this.dragon2, this.ronin);
                expect(this.dragon2.parent).toBe(this.ronin);
                expect(this.dragon.location).toBe('conflict discard pile');
                expect(this.ronin.attachments.length).toBe(1);
            });

            it('does not allow another trigger after it leaves play and a new copy is attached once the limit was reached (ruling #595)', function() {
                this.player1.playAttachment(this.dragon, this.ronin);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ronin],
                    defenders: [this.peacemaker]
                });
                this.player2.pass();
                this.player1.clickCard(this.ronin);
                this.player2.pass();
                this.player1.clickCard(this.ronin);
                this.player2.pass();
                this.player1.clickCard(this.ronin);
                expect(this.ronin.fate).toBe(1);
                this.player2.pass();
                this.player1.clickCard(this.letGo);
                this.player1.clickCard(this.dragon);
                expect(this.dragon.location).toBe('conflict discard pile');
                this.player2.pass();
                this.player1.clickCard(this.ronin);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.ronin.fate).toBe(1);
                this.player1.playAttachment(this.dragon2, this.ronin);
                expect(this.dragon2.parent).toBe(this.ronin);
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.ronin);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.ronin.fate).toBe(1);
                expect(this.ronin.militarySkill).toBe(9);
            });
        });

        describe('on a character with a Max ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 5,
                        inPlay: ['austere-exemplar'],
                        hand: ['way-of-the-dragon']
                    },
                    player2: {
                        inPlay: ['shiba-peacemaker']
                    }
                });
                this.exemplar = this.player1.findCardByName('austere-exemplar');
                this.dragon = this.player1.findCardByName('way-of-the-dragon');
                this.peacemaker = this.player2.findCardByName('shiba-peacemaker');
            });

            it('does not allow a Max 1 per conflict ability a second time in the conflict (ruling #124)', function() {
                this.player1.playAttachment(this.dragon, this.exemplar);
                expect(this.player1.fate).toBe(3);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.exemplar],
                    defenders: [this.peacemaker],
                    ring: 'air'
                });
                this.player2.pass();
                this.player1.clickCard(this.exemplar);
                expect(this.player1).toHavePrompt('Select a ring to place fate on');
                this.player1.clickRing('water');
                expect(this.game.rings.water.fate).toBe(1);
                expect(this.player1.fate).toBe(2);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.exemplar);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player1).not.toHavePrompt('Select a ring to place fate on');
                expect(this.game.rings.water.fate).toBe(1);
                expect(this.player1.fate).toBe(2);
            });
        });

        describe('on a character with a gained ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 5,
                        honor: 10,
                        inPlay: ['matsu-berserker'],
                        hand: ['way-of-the-dragon', 'duelist-training']
                    },
                    player2: {
                        honor: 10,
                        inPlay: ['doji-whisperer', 'ikoma-prodigy', 'kakita-asami']
                    }
                });
                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.dragon = this.player1.findCardByName('way-of-the-dragon');
                this.training = this.player1.findCardByName('duelist-training');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.prodigy = this.player2.findCardByName('ikoma-prodigy');
                this.asami = this.player2.findCardByName('kakita-asami');
            });

            it('lets the attached character trigger an ability gained from Duelist Training an additional time (ruling #567)', function() {
                this.player1.playAttachment(this.training, this.berserker);
                this.player2.pass();
                this.player1.playAttachment(this.dragon, this.berserker);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.berserker],
                    defenders: [this.whisperer, this.prodigy, this.asami]
                });
                this.player2.pass();

                this.player1.clickCard(this.berserker);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                this.player1.clickCard(this.whisperer);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.whisperer.bowed).toBe(true);

                this.player2.pass();
                this.player1.clickCard(this.berserker);
                expect(this.player1).toBeAbleToSelect(this.prodigy);
                this.player1.clickCard(this.prodigy);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.prodigy.bowed).toBe(true);

                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.berserker);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player1).not.toBeAbleToSelect(this.asami);
                expect(this.asami.bowed).toBe(false);
            });
        });
    });
});
