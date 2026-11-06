describe('Humble Magistrate', function() {
    integration(function() {
        describe('Humble Magistrate\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['humble-magistrate', 'bayushi-kachiko'],
                        hand: []
                    },
                    player2: {
                        inPlay: ['kudaka', 'vanguard-warrior']
                    }
                });
                this.HumbleMagistrate = this.player1.findCardByName('humble-magistrate');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['humble-magistrate', 'bayushi-kachiko'],
                    defenders: ['kudaka', 'vanguard-warrior']
                });
                this.conflict = this.game.currentConflict;
            });

            it('shouldn\'t count kachiko\'s skill', function() {
                expect(this.conflict.attackerSkill).toBe(2);
            });

            it('Shouldn\'t count kudaka\'s skill', function() {
                expect(this.conflict.defenderSkill).toBe(2);
            });
        });

        describe('Humble Magistrate\'s ability when it is not attacking', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['humble-magistrate', 'bayushi-kachiko']
                    },
                    player2: {
                        inPlay: ['kudaka', 'vanguard-warrior']
                    }
                });
                this.magistrate = this.player1.findCardByName('humble-magistrate');
                this.kachiko = this.player1.findCardByName('bayushi-kachiko');
                this.kudaka = this.player2.findCardByName('kudaka');
                this.vanguard = this.player2.findCardByName('vanguard-warrior');
                this.noMoreActions();
            });

            it('counts the skill of cost 4 or higher characters while Humble Magistrate is defending', function() {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kudaka, this.vanguard],
                    defenders: [this.magistrate, this.kachiko]
                });
                expect(this.magistrate.isDefending()).toBe(true);
                expect(this.game.currentConflict.attackerSkill).toBe(5);
                expect(this.game.currentConflict.defenderSkill).toBe(5);
            });

            it('counts the skill of cost 4 or higher characters while Humble Magistrate is at home', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kachiko],
                    defenders: [this.kudaka]
                });
                expect(this.magistrate.isParticipating()).toBe(false);
                expect(this.kachiko.isAttacking()).toBe(true);
                expect(this.game.currentConflict.attackerSkill).toBe(3);
                expect(this.game.currentConflict.defenderSkill).toBe(3);
            });
        });

        describe('Humble Magistrate\'s ability and cost 3 characters', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['humble-magistrate', 'siege-captain']
                    },
                    player2: {
                        inPlay: ['serene-warrior']
                    }
                });
                this.magistrate = this.player1.findCardByName('humble-magistrate');
                this.siegeCaptain = this.player1.findCardByName('siege-captain');
                this.sereneWarrior = this.player2.findCardByName('serene-warrior');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.magistrate, this.siegeCaptain],
                    defenders: [this.sereneWarrior]
                });
            });

            it('still counts the skill of characters with printed cost 3', function() {
                expect(this.magistrate.isAttacking()).toBe(true);
                expect(this.game.currentConflict.attackerSkill).toBe(7);
                expect(this.game.currentConflict.defenderSkill).toBe(3);
            });
        });
    });
});
