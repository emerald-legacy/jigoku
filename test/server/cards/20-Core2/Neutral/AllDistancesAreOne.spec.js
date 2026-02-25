describe('Talisman of the Sun', function () {
    integration(function () {
        describe('Talisman of the Sun\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shrine-maiden'],
                        provinces: ['manicured-garden']
                    },
                    player2: {
                        provinces: ['public-forum', 'sanpuku-seido'],
                        inPlay: ['serene-warrior', 'adept-of-the-waves'],
                        hand: ['all-distances-are-one']
                    }
                });
                this.adept = this.player2.findCardByName('adept-of-the-waves');
                this.garden = this.player1.findCardByName('manicured-garden');
                this.seido = this.player2.findCardByName('sanpuku-seido');
                this.forum = this.player2.findCardByName('public-forum');
                this.distances = this.player2.findCardByName('all-distances-are-one');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'air',
                    province: 'public-forum',
                    attackers: ['shrine-maiden'],
                    defenders: [this.adept]
                });
            });

            it('should move the conflict to a new province', function () {
                this.player2.clickCard(this.distances);
                expect(this.player2).not.toBeAbleToSelect(this.garden);
                expect(this.player2).not.toBeAbleToSelect(this.forum);
                expect(this.player2).toBeAbleToSelect(this.seido);
                this.sanpukuSeido = this.player2.clickCard(this.seido);
                expect(this.sanpukuSeido.inConflict).toBe(true);
                expect(this.game.currentConflict.conflictProvince).toBe(this.sanpukuSeido);

                expect(this.getChatLogs(4)).toContain('player2 plays All Distances Are One to move the conflict to another eligible province');
                expect(this.getChatLogs(3)).toContain('player2 moves the conflict to Sanpuku Seidō');

                expect(this.forum.facedown).toBe(false);
                this.player2.clickPrompt('Yes');
                expect(this.getChatLogs(5)).toContain('player2 channels their water affinity to flip Public Forum facedown');
                expect(this.forum.facedown).toBe(true);
            });

            it('should apply any constant abilities of the new province', function () {
                this.player2.clickCard(this.distances);
                this.sanpukuSeido = this.player2.clickCard('sanpuku-seido');
                expect(this.game.currentConflict.attackerSkill).toBe(0);
                expect(this.game.currentConflict.defenderSkill).toBe(2);
            });
        });
    });
});
