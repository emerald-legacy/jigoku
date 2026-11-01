describe('Veteran of Toshi Ranbo', function() {
    integration(function() {
        describe('Conflict Phase', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['veteran-of-toshi-ranbo']
                    },
                    player2: {
                        inPlay: ['veteran-of-toshi-ranbo']
                    }
                });

                this.veteran1 = this.player1.findCardByName('veteran-of-toshi-ranbo');
                this.veteran2 = this.player2.findCardByName('veteran-of-toshi-ranbo');

                this.p1 = this.player1.findCardByName('shameful-display', 'province 1');
                this.p2 = this.player1.findCardByName('shameful-display', 'province 2');
                this.p3 = this.player1.findCardByName('shameful-display', 'province 3');
                this.p4 = this.player1.findCardByName('shameful-display', 'province 4');
                this.p4 = this.player1.findCardByName('shameful-display', 'province 4');
                this.pStronghold = this.player1.findCardByName('shameful-display', 'stronghold province');
            });

            it('should have glory equal to the number of faceup provinces you control', function() {
                expect(this.veteran1.glory).toBe(0);
                expect(this.veteran2.glory).toBe(0);

                this.p1.facedown = false;
                this.game.checkGameState(true);
                expect(this.veteran1.glory).toBe(1);
                expect(this.veteran2.glory).toBe(0);

                this.p2.facedown = false;
                this.game.checkGameState(true);
                expect(this.veteran1.glory).toBe(2);
                expect(this.veteran2.glory).toBe(0);

                this.p3.facedown = false;
                this.game.checkGameState(true);
                expect(this.veteran1.glory).toBe(3);
                expect(this.veteran2.glory).toBe(0);

                this.p4.facedown = false;
                this.game.checkGameState(true);
                expect(this.veteran1.glory).toBe(4);
                expect(this.veteran2.glory).toBe(0);

                this.pStronghold.facedown = false;
                this.game.checkGameState(true);
                expect(this.veteran1.glory).toBe(5);
                expect(this.veteran2.glory).toBe(0);
            });
        });
    });
});

describe('Veteran of Toshi Ranbo copied by Shosuro Actor', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shosuro-actor']
                },
                player2: {
                    inPlay: ['veteran-of-toshi-ranbo']
                }
            });
            this.actor = this.player1.findCardByName('shosuro-actor');
            this.veteran = this.player2.findCardByName('veteran-of-toshi-ranbo');
            this.player2.findCardByName('shameful-display', 'province 2').facedown = false;
            this.player2.findCardByName('shameful-display', 'province 3').facedown = false;
        });

        it('counts the faceup provinces of the copy\'s controller', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.actor],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.actor);
            this.player1.clickCard(this.veteran);
            expect(this.actor.name).toBe('Veteran of Toshi Ranbo');
            expect(this.player2.player.getNumberOfFaceupProvinces()).not.toBe(this.player1.player.getNumberOfFaceupProvinces());
            expect(this.actor.glory).toBe(this.veteran.printedGlory + this.player1.player.getNumberOfFaceupProvinces());
        });
    });
});
