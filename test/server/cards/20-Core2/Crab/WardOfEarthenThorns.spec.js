describe('Ward of Earthen Thorns', function () {
    integration(function () {
        describe('province strength bonus', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-yunako']
                    },
                    player2: {
                        inPlay: ['kuni-juurou'],
                        hand: ['ward-of-earthen-thorns'],
                        provinces: ['manicured-garden']
                    }
                });

                this.yunako = this.player1.findCardByName('bayushi-yunako');

                this.wardOfEarthenThorns = this.player2.findCardByName('ward-of-earthen-thorns');
                this.juurou = this.player2.findCardByName('kuni-juurou');
                this.manicured = this.player2.findCardByName('manicured-garden');

                this.player1.pass();
                this.player2.playAttachment(this.wardOfEarthenThorns, this.manicured);
                this.noMoreActions();
            });

            it('gives gives no strength without affinity', function () {
                this.player1.moveCard(this.juurou, 'dynasty discard pile');

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yunako],
                    defenders: [],
                    province: this.manicured
                });

                this.noMoreActions();
                expect(this.getChatLogs(5)).toContain('player1 has broken Manicured Garden!');
            });

            it('is discarded when the attached province is broken', function () {
                this.player1.moveCard(this.juurou, 'dynasty discard pile');

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yunako],
                    defenders: [],
                    province: this.manicured
                });

                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.manicured.isBroken).toBe(true);
                expect(this.wardOfEarthenThorns.location).toBe('conflict discard pile');
                expect(this.getChatLogs(10)).toContain(
                    'Ward of Earthen Thorns is discarded from Manicured Garden as it is no longer legally attached'
                );
            });

            it('gives gives +1 strength with affinity', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yunako],
                    defenders: [],
                    province: this.manicured
                });

                this.noMoreActions();
                expect(this.getChatLogs(5)).not.toContain('player1 has broken Manicured Garden!');
            });
        });

        describe('attaching to a broken province', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-yunako']
                    },
                    player2: {
                        inPlay: ['kuni-juurou'],
                        hand: ['ward-of-earthen-thorns'],
                        provinces: ['manicured-garden', 'elemental-fury']
                    }
                });

                this.wardOfEarthenThorns = this.player2.findCardByName('ward-of-earthen-thorns');
                this.manicured = this.player2.findCardByName('manicured-garden');
                this.elementalFury = this.player2.findCardByName('elemental-fury');
                this.opponentProvince = this.player1.findCardByName('shameful-display', 'province 1');
                this.manicured.isBroken = true;

                this.player1.pass();
            });

            it('cannot be attached to a broken province', function () {
                this.player2.clickCard(this.wardOfEarthenThorns);
                expect(this.player2).not.toBeAbleToSelect(this.manicured);
                expect(this.player2).toBeAbleToSelect(this.elementalFury);
            });

            it('can be attached to an unbroken province the opponent controls', function () {
                this.player2.clickCard(this.wardOfEarthenThorns);
                expect(this.player2).toBeAbleToSelect(this.opponentProvince);
            });
        });

        describe('conflict action', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-yunako']
                    },
                    player2: {
                        inPlay: ['kuni-juurou'],
                        hand: ['ward-of-earthen-thorns'],
                        provinces: ['manicured-garden']
                    }
                });

                this.yunako = this.player1.findCardByName('bayushi-yunako');
                this.yunako.fate = 1;

                this.wardOfEarthenThorns = this.player2.findCardByName('ward-of-earthen-thorns');
                this.manicured = this.player2.findCardByName('manicured-garden');

                this.player1.pass();
                this.player2.playAttachment(this.wardOfEarthenThorns, this.manicured);
                this.noMoreActions();
            });

            it('gives gives no strength without affinity', function () {
                this.initiateConflict({
                    attackers: [this.yunako],
                    defenders: [],
                    province: this.manicured
                });

                this.player2.clickCard(this.wardOfEarthenThorns);

                expect(this.player2).toHavePrompt('Choose a character');

                this.player2.clickCard(this.yunako);
                expect(this.yunako.fate).toBe(0);
                expect(this.getChatLogs(5)).toContain(
                    'player2 uses Ward of Earthen Thorns to remove 1 fate from Bayushi Yunako'
                );
            });
        });
    });
});
