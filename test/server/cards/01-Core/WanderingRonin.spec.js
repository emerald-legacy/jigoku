describe('Wandering Ronin', function() {
    integration(function() {
        describe('with fate', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: [{ card: 'wandering-ronin', fate: 3 }]
                    },
                    player2: {
                        inPlay: ['shiba-peacemaker']
                    }
                });
                this.ronin = this.player1.findCardByName('wandering-ronin');
                this.peacemaker = this.player2.findCardByName('shiba-peacemaker');
            });

            it('removes 1 fate from itself to get +2 military and +2 political', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ronin],
                    defenders: [this.peacemaker]
                });
                this.player2.pass();
                this.player1.clickCard(this.ronin);
                expect(this.ronin.fate).toBe(2);
                expect(this.ronin.militarySkill).toBe(4);
                expect(this.ronin.politicalSkill).toBe(4);
            });

            it('can be used twice per conflict but not a third time', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ronin],
                    defenders: [this.peacemaker]
                });
                this.player2.pass();
                this.player1.clickCard(this.ronin);
                this.player2.pass();
                this.player1.clickCard(this.ronin);
                expect(this.ronin.fate).toBe(1);
                expect(this.ronin.militarySkill).toBe(6);
                expect(this.ronin.politicalSkill).toBe(6);
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.ronin);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.ronin.fate).toBe(1);
                expect(this.ronin.militarySkill).toBe(6);
            });

            it('cannot be used outside a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.ronin);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.ronin.fate).toBe(3);
                expect(this.ronin.militarySkill).toBe(2);
            });
        });

        describe('without fate', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['wandering-ronin']
                    },
                    player2: {
                        inPlay: ['shiba-peacemaker']
                    }
                });
                this.ronin = this.player1.findCardByName('wandering-ronin');
                this.peacemaker = this.player2.findCardByName('shiba-peacemaker');
            });

            it('cannot be used without fate to remove', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ronin],
                    defenders: [this.peacemaker]
                });
                this.player2.pass();
                expect(this.ronin.fate).toBe(0);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.ronin);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.ronin.militarySkill).toBe(2);
            });
        });
    });
});
