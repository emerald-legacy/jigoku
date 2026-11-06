describe('Kitsu Warrior', function () {
    integration(function () {
        describe('Kitsu Warrior\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsu-warrior']
                    },
                    player2: {
                        inPlay: ['doomed-shugenja','eager-scout'],
                        hand: ['cloud-the-mind']
                    }
                });
                this.kitsu = this.player1.findCardByName('kitsu-warrior');
                this.shug = this.player2.findCardByName('doomed-shugenja');
                this.cloud = this.player2.findCardByName('cloud-the-mind');


            });

            it('should correctly give 2 military skill for each military claimed ring', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: [this.kitsu],
                    defenders: ['eager-scout'],
                    jumpTo: 'afterConflict'
                });
                this.player1.clickPrompt('Take 1 honor from opponent');
                expect(this.game.rings.air.claimed).toBe(true);
                expect(this.kitsu.militarySkill).toBe(4);
                expect(this.kitsu.politicalSkill).toBe(2);
                this.player2.claimRing('fire');
                expect(this.game.rings.fire.claimed).toBe(true);
                expect(this.kitsu.militarySkill).toBe(6);
                expect(this.kitsu.politicalSkill).toBe(2);
            });

            it('should correctly give 2 political skill for each political claimed ring', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    ring: 'earth',
                    attackers: [this.kitsu],
                    defenders: ['eager-scout'],
                    jumpTo: 'afterConflict'
                });
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.game.rings.earth.claimed).toBe(true);
                expect(this.kitsu.militarySkill).toBe(2);
                expect(this.kitsu.politicalSkill).toBe(4);
                this.player2.claimRing('fire');
                expect(this.kitsu.militarySkill).toBe(4);
                expect(this.kitsu.politicalSkill).toBe(4);
            });

            it('should correctly modify skills if blanked', function () {
                this.player2.claimRing('fire');
                expect(this.kitsu.militarySkill).toBe(4);
                expect(this.kitsu.politicalSkill).toBe(2);
                this.player1.pass();
                this.player2.clickCard(this.cloud);
                this.player2.clickCard(this.kitsu);
                expect(this.kitsu.militarySkill).toBe(2);
                expect(this.kitsu.politicalSkill).toBe(2);
            });
        });
    });
});

describe('Kitsu Warrior and a Secluded Shrine ring', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'draw',
                player1: {
                    dynastyDeck: ['secluded-shrine'],
                    inPlay: ['doji-whisperer']
                },
                player2: {
                    inPlay: ['kitsu-warrior']
                }
            });
            this.secludedShrine = this.player1.placeCardInProvince('secluded-shrine', 'province 1');
            this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
            this.kitsu = this.player2.findCardByName('kitsu-warrior');

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            this.noMoreActions();
            this.player1.clickCard(this.secludedShrine);
            this.player1.clickRing('fire');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'fire',
                attackers: [this.dojiWhisperer],
                defenders: [this.kitsu]
            });
        });

        // ruling #666: the Shrine's ring has no conflict type until a player claims it (Shiotome Encampment got this fix in round 11)
        it('does not count the contested Shrine ring as a claimed military ring', function() {
            expect(this.game.rings.fire.isConsideredClaimed(this.player1.player)).toBe(true);
            expect(this.game.rings.fire.isClaimed()).toBe(false);
            expect(this.kitsu.politicalSkill).toBe(2);
            expect(this.kitsu.militarySkill).toBe(2);
        });
    });
});
