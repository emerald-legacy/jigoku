describe('SoD - Unicorn', function () {
    integration(function () {
        describe('Campfire Counsel', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-liar', 'kakita-toshimoko', 'keeper-initiate'],
                        dynastyDiscard: ['campfire-counsel'],
                        hand: ['renowned-singer']
                    },
                    player2: {
                        inPlay: ['doji-diplomat'],
                        hand: ['assassination', 'let-go', 'duelist-training']
                    }
                });

                this.liar = this.player1.findCardByName('bayushi-liar');
                this.keeper = this.player1.findCardByName('keeper-initiate');
                this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                this.campfire = this.player1.findCardByName('campfire-counsel');
                this.singer = this.player1.findCardByName('renowned-singer');

                this.player1.placeCardInProvince(this.campfire, 'province 1');
                this.liar.bow();
                this.toshimoko.bow();
            });

            it('should work', function () {
                this.noMoreActions();

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.keeper],
                    defenders: []
                });

                this.player2.pass();

                this.player1.clickCard(this.campfire);
                expect(this.player1).toBeAbleToSelect(this.liar);
                expect(this.player1).not.toBeAbleToSelect(this.keeper);
                expect(this.player1).not.toBeAbleToSelect(this.toshimoko);
                this.player1.clickCard(this.liar);

                expect(this.liar.isDishonored).toBe(true);
                expect(this.liar.bowed).toBe(false);
                expect(this.getChatLogs(5)).toContain('player1 uses Campfire Counsel, sacrificing Campfire Counsel to ready Bayushi Liar');
                expect(this.getChatLogs(5)).toContain('Bayushi Liar is dishonored');
            });

            it('with storyteller should work', function () {
                this.player1.clickCard(this.singer);
                this.player1.clickPrompt('0');

                this.noMoreActions();

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.keeper],
                    defenders: []
                });

                this.player2.pass();

                this.player1.clickCard(this.campfire);
                expect(this.player1).toBeAbleToSelect(this.liar);
                expect(this.player1).not.toBeAbleToSelect(this.keeper);
                expect(this.player1).not.toBeAbleToSelect(this.toshimoko);
                this.player1.clickCard(this.liar);

                expect(this.liar.isDishonored).toBe(false);
                expect(this.liar.bowed).toBe(false);
                expect(this.getChatLogs(5)).toContain('player1 uses Campfire Counsel, sacrificing Campfire Counsel to ready Bayushi Liar');
                expect(this.getChatLogs(5)).not.toContain('Bayushi Liar is dishonored');
            });
        });

        describe('Cornering Maneuver', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-liar', 'kakita-toshimoko', 'keeper-initiate'],
                        hand: ['cornering-maneuver']
                    },
                    player2: {
                        inPlay: ['doji-diplomat', 'brash-samurai'],
                        hand: ['assassination', 'let-go', 'duelist-training']
                    }
                });

                this.liar = this.player1.findCardByName('bayushi-liar');
                this.keeper = this.player1.findCardByName('keeper-initiate');
                this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                this.diplomat = this.player2.findCardByName('doji-diplomat');
                this.brash = this.player2.findCardByName('brash-samurai');
                this.cornering = this.player1.findCardByName('cornering-maneuver');
            });

            it('should work', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toshimoko],
                    defenders: [this.brash]
                });

                this.player2.pass();

                this.player1.clickCard(this.cornering);
                expect(this.player1).toBeAbleToSelect(this.toshimoko);
                expect(this.player1).not.toBeAbleToSelect(this.keeper);
                expect(this.player1).not.toBeAbleToSelect(this.liar);
                expect(this.player1).not.toBeAbleToSelect(this.brash);

                let mil = this.toshimoko.getMilitarySkill();

                this.player1.clickCard(this.toshimoko);
                expect(this.getChatLogs(5)).toContain('player1 plays Cornering Maneuver to give Kakita Toshimoko +2military');

                expect(this.toshimoko.getMilitarySkill()).toBe(mil + 2);
                expect(this.player1).toHavePrompt('Choose a character to move');
                expect(this.player1).toBeAbleToSelect(this.toshimoko);
                expect(this.player1).toBeAbleToSelect(this.keeper);
                expect(this.player1).not.toBeAbleToSelect(this.liar);
                expect(this.player1).not.toBeAbleToSelect(this.brash);

                expect(this.keeper.isParticipating()).toBe(false);
                this.player1.clickCard(this.keeper);
                expect(this.keeper.isParticipating()).toBe(true);
                expect(this.getChatLogs(5)).toContain('player1 moves Keeper Initiate to the conflict');
            });

            it('send home', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toshimoko],
                    defenders: [this.brash]
                });

                this.player2.pass();

                this.player1.clickCard(this.cornering);
                this.player1.clickCard(this.toshimoko);
                this.player1.clickCard(this.toshimoko);
                expect(this.toshimoko.isParticipating()).toBe(false);
                expect(this.getChatLogs(5)).toContain('player1 moves Kakita Toshimoko home');
            });

            it('outnumbering', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toshimoko, this.keeper],
                    defenders: [this.brash]
                });

                this.player2.pass();

                this.player1.clickCard(this.cornering);
                this.player1.clickCard(this.toshimoko);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Incesssant Moto', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kakita-toshimoko'],
                        hand: ['admit-defeat']
                    },
                    player2: {
                        inPlay: ['incessant-moto'],
                        hand: ['way-of-the-scorpion']
                    }
                });

                this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                this.moto = this.player2.findCardByName('incessant-moto');
                this.defeat = this.player1.findCardByName('admit-defeat');
                this.scorp = this.player2.findCardByName('way-of-the-scorpion');
            });

            it('should contribute when bowed', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toshimoko],
                    defenders: [this.moto]
                });

                this.player2.pass();

                expect(this.game.currentConflict.attackerSkill).toBe(4);
                expect(this.game.currentConflict.defenderSkill).toBe(1);

                this.player1.clickCard(this.defeat);
                this.player1.clickCard(this.moto);

                expect(this.game.currentConflict.attackerSkill).toBe(4);
                expect(this.game.currentConflict.defenderSkill).toBe(1);
                expect(this.moto.bowed).toBe(true);

                this.toshimoko.bowed = true;
                this.game.checkGameState(true);
                expect(this.game.currentConflict.attackerSkill).toBe(0);
                expect(this.game.currentConflict.defenderSkill).toBe(1);
            });

            it('should move in after event', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toshimoko],
                    defenders: []
                });

                this.player2.clickCard(this.scorp);
                this.player2.clickCard(this.toshimoko);

                expect(this.player2).toBeAbleToSelect(this.moto);
                this.player2.clickCard(this.moto);

                expect(this.moto.isParticipating()).toBe(true);
                expect(this.getChatLogs(5)).toContain('player2 uses Incessant Moto to move Incessant Moto into the conflict');
            });
        });

        describe('Utaku Tomoe', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kakita-toshimoko'],
                        hand: ['admit-defeat']
                    },
                    player2: {
                        inPlay: ['utaku-tomoe', 'moto-youth', 'moto-horde'],
                        hand: ['dispatch']
                    }
                });

                this.tomoe = this.player2.findCardByName('utaku-tomoe');
                this.youth = this.player2.findCardByName('moto-youth');
                this.horde = this.player2.findCardByName('moto-horde');
                this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                this.dispatch = this.player2.findCardByName('dispatch');

                this.youth.bow();
                this.horde.bow();
            });

            it('should work', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toshimoko],
                    defenders: []
                });

                this.player2.clickCard(this.dispatch);
                this.player2.clickCard(this.youth);

                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.tomoe);

                this.player2.clickCard(this.tomoe);
                expect(this.youth.bowed).toBe(false);

                expect(this.getChatLogs(5)).toContain('player2 uses Utaku Tomoe to ready Moto Youth');
            });

            it('cost too high', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toshimoko],
                    defenders: []
                });

                this.player2.clickCard(this.dispatch);
                this.player2.clickCard(this.horde);

                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('not bowed', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toshimoko],
                    defenders: []
                });

                this.player2.clickCard(this.dispatch);
                this.player2.clickCard(this.tomoe);

                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Strange Mirror', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kakita-toshimoko', 'keeper-initiate'],
                        hand: ['strange-mirror']
                    },
                    player2: {
                        inPlay: ['utaku-tomoe', 'moto-youth'],
                        hand: ['dispatch']
                    }
                });

                this.mirror = this.player1.findCardByName('strange-mirror');
                this.tomoe = this.player2.findCardByName('utaku-tomoe');
                this.youth = this.player2.findCardByName('moto-youth');
                this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                this.keeper = this.player1.findCardByName('keeper-initiate');

                this.player1.playAttachment(this.mirror, this.toshimoko);
                this.player2.pass();
            });

            it('should work', function () {
                this.player1.clickCard(this.mirror);
                expect(this.player1).toBeAbleToSelect(this.tomoe);
                expect(this.player1).toBeAbleToSelect(this.youth);
                expect(this.player1).not.toBeAbleToSelect(this.toshimoko);
                expect(this.player1).not.toBeAbleToSelect(this.keeper);

                this.player1.clickCard(this.youth);
                expect(this.player1).not.toBeAbleToSelect(this.toshimoko);
                expect(this.player1).toBeAbleToSelect(this.keeper);

                this.player1.clickCard(this.keeper);
                expect(this.keeper.name).toBe(this.youth.name);
                expect(this.keeper.getCost()).toBe(this.youth.getCost());
                expect(this.keeper.getBaseMilitarySkill()).toBe(this.youth.printedMilitarySkill);
                expect(this.keeper.getPoliticalSkill()).toBe(this.youth.printedPoliticalSkill);
                expect(this.keeper.getTraits()).toContain('bushi');
                expect(this.keeper.getTraits()).not.toContain('monk');

                expect(this.mirror.location).toBe('play area');

                expect(this.getChatLogs(5)).toContain('player1 uses Strange Mirror to turn Keeper Initiate into a copy of Moto Youth');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.keeper],
                    defenders: [this.tomoe, this.youth]
                });

                this.noMoreActions();

                expect(this.keeper.name).toBe(this.keeper.printedName);
                expect(this.keeper.getCost()).toBe(this.keeper.printedCost);
                expect(this.keeper.getBaseMilitarySkill()).toBe(this.keeper.printedMilitarySkill);
                expect(this.keeper.getPoliticalSkill()).toBe(this.keeper.printedPoliticalSkill);
                expect(this.keeper.getTraits()).not.toContain('bushi');
                expect(this.keeper.getTraits()).toContain('monk');
            });

            it('uniques', function () {
                this.player1.clickCard(this.mirror);
                this.player1.clickCard(this.tomoe);
                expect(this.player1).toBeAbleToSelect(this.toshimoko);
                expect(this.player1).not.toBeAbleToSelect(this.keeper);

                this.player1.clickCard(this.toshimoko);
                expect(this.toshimoko.name).toBe(this.tomoe.name);
                expect(this.mirror.location).toBe('conflict discard pile');

                expect(this.getChatLogs(5)).toContain('player1 uses Strange Mirror to turn Kakita Toshimoko into a copy of Utaku Tomoe');
                expect(this.getChatLogs(5)).toContain('Strange Mirror is discarded because the chosen characters are unique');
            });
        });

        describe('Into the Storm', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kakita-toshimoko'],
                        hand: ['admit-defeat', 'fine-katana']
                    },
                    player2: {
                        inPlay: ['incessant-moto'],
                        hand: ['way-of-the-scorpion', 'shiksha-scout', 'into-the-storm']
                    }
                });

                this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                this.moto = this.player2.findCardByName('incessant-moto');
                this.defeat = this.player1.findCardByName('admit-defeat');
                this.katana = this.player1.findCardByName('fine-katana');
                this.scorp = this.player2.findCardByName('way-of-the-scorpion');
                this.scout = this.player2.findCardByName('shiksha-scout');
                this.storm = this.player2.findCardByName('into-the-storm');
            });

            it('should work', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toshimoko],
                    defenders: [this.moto]
                });

                let fate1 = this.player1.fate;
                let fate2 = this.player2.fate;

                this.player2.clickCard(this.storm);

                expect(this.player2.fate).toBe(fate2);
                expect(this.getChatLogs(5)).toContain('player2 plays Into the Storm to increase the cost of events this conflict by 1');

                this.player1.clickCard(this.defeat);
                this.player1.clickCard(this.moto);

                expect(this.player1.fate).toBe(fate1 - 2);

                this.player2.clickCard(this.scout);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Conflict');

                expect(this.player2.fate).toBe(fate2 - 2); // doesn't affect characters

                this.player1.clickCard(this.katana);
                this.player1.clickCard(this.toshimoko);

                expect(this.player1.fate).toBe(fate1 - 2); // doesn't affect attachments

                this.player2.clickCard(this.scorp);
                this.player2.clickCard(this.toshimoko);

                expect(this.player2.fate).toBe(fate2 - 3);
                expect(this.getChatLogs(10)).toContain('The storm abates, events no longer cost 1 more');
            });

            it('gaining fate and expiry', function () {
                this.player1.pass();
                this.player2.clickCard(this.scout);
                this.player2.clickPrompt('0');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toshimoko],
                    defenders: [this.moto]
                });

                let fate1 = this.player1.fate;
                let fate2 = this.player2.fate;

                this.player2.clickCard(this.storm);

                expect(this.player2.fate).toBe(fate2 + 1);
                expect(this.getChatLogs(5)).toContain('player2 plays Into the Storm to increase the cost of events this conflict by 1 and gain 1 fate');

                this.player1.clickCard(this.katana);
                this.player1.clickCard(this.toshimoko);

                expect(this.player1.fate).toBe(fate1);

                this.player2.clickCard(this.scorp);
                this.player2.clickCard(this.toshimoko);

                expect(this.player2.fate).toBe(fate2);
                expect(this.getChatLogs(10)).toContain('The storm abates, events no longer cost 1 more');

                this.player1.clickCard(this.defeat);
                this.player1.clickCard(this.moto);

                expect(this.player1.fate).toBe(fate1 - 1);
            });
        });
    });
});
