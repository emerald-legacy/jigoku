describe('Vassal Fields', function() {
    integration(function() {
        describe('Vassal Fields\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsuki-yaruma'],
                        fate: 10
                    },
                    player2: {
                        provinces: ['vassal-fields'],
                        fate: 11
                    }
                });
                this.yaruma = this.player1.findCardByName('kitsuki-yaruma');

                this.fields = this.player2.findCardByName('vassal-fields');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yaruma],
                    province: this.fields,
                    defenders: []
                });
            });

            it('should make the opponent lose 1 fate', function() {
                this.player2.clickCard(this.fields);
                expect(this.player1.fate).toBe(9);
                expect(this.player2.fate).toBe(11);
            });
        });

        describe('Vassal Fields\'s ability outside a conflict at this province', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsuki-yaruma'],
                        fate: 10
                    },
                    player2: {
                        provinces: ['vassal-fields'],
                        fate: 11
                    }
                });
                this.yaruma = this.player1.findCardByName('kitsuki-yaruma');
                this.fields = this.player2.findCardByName('vassal-fields');
                this.otherProvince = this.player2.provinces['province 2'].provinceCard;
            });

            it('cannot be used outside a conflict', function() {
                this.fields.facedown = false;
                this.player1.pass();
                expect(this.player2).toHavePrompt('Action Window');
                this.player2.clickCard(this.fields);
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.player1.fate).toBe(10);
                expect(this.player2.fate).toBe(11);
            });

            it('cannot be used during a conflict at another province', function() {
                this.fields.facedown = false;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yaruma],
                    province: this.otherProvince,
                    defenders: []
                });
                expect(this.otherProvince.isConflictProvince()).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.fields);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.player1.fate).toBe(10);
                expect(this.player2.fate).toBe(11);
            });
        });

        describe('Vassal Fields\'s ability when the opponent has no fate', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsuki-yaruma'],
                        fate: 0
                    },
                    player2: {
                        provinces: ['vassal-fields'],
                        fate: 11
                    }
                });
                this.yaruma = this.player1.findCardByName('kitsuki-yaruma');
                this.fields = this.player2.findCardByName('vassal-fields');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yaruma],
                    province: this.fields,
                    defenders: []
                });
            });

            it('cannot be used when the opponent has 0 fate', function() {
                expect(this.fields.isConflictProvince()).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.fields);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.player1.fate).toBe(0);
            });
        });
    });
});
