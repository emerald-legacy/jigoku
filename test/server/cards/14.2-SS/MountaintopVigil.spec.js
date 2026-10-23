describe('Mountaintop Vigil', function() {
    integration(function() {
        describe('Mountaintop Vigil\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shiba-tsukune', 'chukan-nobue', 'kami-unleashed'],
                        hand: ['seeker-of-knowledge', 'fine-katana', 'charge']
                    },
                    player2: {
                        provinces: ['pilgrimage', 'toshi-ranbo', 'manicured-garden'],
                        inPlay: ['garanto-guardian'],
                        hand: ['mountaintop-vigil']
                    }
                });

                this.guardian = this.player2.findCardByName('garanto-guardian');
                this.tsukune = this.player1.findCardByName('shiba-tsukune');
                this.chukan = this.player1.findCardByName('chukan-nobue');
                this.kami = this.player1.findCardByName('kami-unleashed');
                this.vigil = this.player2.findCardByName('mountaintop-vigil');
                this.noMoreActions();
            });

            it('should stop the ring effect from the conflict', function() {
                this.initiateConflict({
                    province: 'manicured-garden',
                    ring: 'fire',
                    type: 'military',
                    attackers: [this.tsukune],
                    defenders: [this.guardian]
                });
                this.player2.clickCard(this.vigil);
                this.player1.pass();
                this.player2.pass();
                this.player1.clickCard(this.tsukune);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.getChatLogs(5)).toContain('player1\'s ring effect is cancelled');
                expect(this.game.rings.fire.isConsideredClaimed(this.player1)).toBe(true);
                expect(this.tsukune.isHonored).toBe(false);
            });

            it('should stop the ring effect resolved through card effects - player of Mountaintop Vigil', function() {
                this.initiateConflict({
                    province: 'manicured-garden',
                    ring: 'fire',
                    type: 'military',
                    attackers: [this.chukan],
                    defenders: [this.guardian]
                });
                this.player2.clickCard(this.vigil);
                this.player1.pass();
                this.player2.pass();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.guardian);
                this.player2.clickCard(this.guardian);
                this.player2.clickRing('air');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.getChatLogs(5)).toContain('player2\'s ring effect is cancelled');
                expect(this.game.rings.fire.isConsideredClaimed(this.player2)).toBe(true);
            });

            it('should stop the ring effect resolved through card effects - opponent of Mountaintop Vigil', function() {
                this.initiateConflict({
                    province: 'manicured-garden',
                    ring: 'fire',
                    type: 'military',
                    attackers: [this.kami],
                    defenders: [this.guardian]
                });
                this.player2.clickCard(this.vigil);
                this.player1.clickCard(this.kami);
                this.player2.clickRing('fire');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.getChatLogs(5)).toContain('player1\'s ring effect is cancelled');
                expect(this.kami.location).toBe('conflict discard pile');
            });
        });

        describe('Mountaintop Vigil against ring effect replacements', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-isamu', 'adept-of-the-waves'],
                        dynastyDeck: ['naive-student'],
                        hand: ['leniency', 'retreat']
                    },
                    player2: {
                        provinces: ['shameful-display'],
                        inPlay: ['shinjo-outrider'],
                        hand: ['mountaintop-vigil']
                    }
                });
                this.player1.placeCardInProvince('naive-student', 'province 1');
                this.naiveStudent = this.player1.findCardByName('naive-student');
                this.isamu = this.player1.findCardByName('shinjo-isamu');
                this.noMoreActions();
            });

            it('should cancel a card\'s ring effect before Leniency can replace it', function() {
                this.initiateConflict({
                    ring: 'earth',
                    type: 'military',
                    attackers: [this.isamu, 'adept-of-the-waves'],
                    defenders: []
                });
                this.player2.clickCard('mountaintop-vigil');
                this.player1.clickCard('retreat');
                this.player1.clickCard(this.isamu);
                this.player1.clickCard(this.isamu);
                this.player1.clickRing('void');
                expect(this.getChatLogs(3)).toContain('player1\'s ring effect is cancelled');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.naiveStudent.location).toBe('province 1');
            });
        });
    });
});
