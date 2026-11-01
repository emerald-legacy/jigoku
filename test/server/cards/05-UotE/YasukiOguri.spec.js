describe('Yasuki Oguri', function() {
    integration(function() {
        describe('Yasuki Oguri\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-outrider'],
                        hand: ['banzai']
                    },
                    player2: {
                        inPlay: ['yasuki-oguri']
                    }
                });
                this.oguri = this.player2.findCardByName('yasuki-oguri');
                this.outrider = this.player1.findCardByName('shinjo-outrider');

                this.noMoreActions();
            });

            it('should trigger when the opponent plays event during a conflict while Oguri is defending', function() {
                this.initiateConflict({
                    attackers: [this.outrider],
                    defenders: [this.oguri]
                });

                this.player2.pass();
                this.player1.clickCard('banzai', 'hand');
                this.player1.clickCard(this.outrider);
                this.player1.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.oguri);
            });

            it('should not trigger if Oguri is not defending', function() {
                this.initiateConflict({
                    attackers: [this.outrider],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard('banzai', 'hand');
                this.player1.clickCard(this.outrider);
                this.player1.clickPrompt('Done');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).not.toBeAbleToSelect(this.oguri);
                expect(this.outrider.militarySkill).toBe(4);
            });

            it('should give him +1/+1', function() {
                this.mil = this.oguri.militarySkill;
                this.pol = this.oguri.politicalSkill;

                this.initiateConflict({
                    attackers: [this.outrider],
                    defenders: [this.oguri]
                });

                this.player2.pass();
                this.player1.clickCard('banzai', 'hand');
                this.player1.clickCard(this.outrider);
                this.player1.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.oguri);
                this.player2.clickCard(this.oguri);
                expect(this.oguri.militarySkill).toBe(this.mil + 1);
                expect(this.oguri.politicalSkill).toBe(this.pol + 1);
            });
        });

        describe('Yasuki Oguri\'s ability with several events', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-outrider'],
                        hand: ['banzai', 'paralyzing-delicacy']
                    },
                    player2: {
                        inPlay: ['yasuki-oguri'],
                        hand: ['banzai']
                    }
                });
                this.oguri = this.player2.findCardByName('yasuki-oguri');
                this.outrider = this.player1.findCardByName('shinjo-outrider');
                this.banzai = this.player1.findCardByName('banzai', 'hand');
                this.delicacy = this.player1.findCardByName('paralyzing-delicacy', 'hand');
                this.ownBanzai = this.player2.findCardByName('banzai', 'hand');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.outrider],
                    defenders: [this.oguri]
                });
            });

            it('does not trigger when its controller plays an event', function() {
                this.player2.clickCard(this.ownBanzai);
                this.player2.clickCard(this.oguri);
                this.player2.clickPrompt('Done');
                expect(this.ownBanzai.location).toBe('conflict discard pile');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.oguri.militarySkill).toBe(3);
                expect(this.oguri.politicalSkill).toBe(1);
            });

            it('triggers once for each event the opponent plays (ruling #505)', function() {
                this.player2.pass();
                this.player1.clickCard(this.banzai);
                this.player1.clickCard(this.outrider);
                this.player1.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.oguri);
                expect(this.oguri.militarySkill).toBe(2);
                expect(this.oguri.politicalSkill).toBe(2);
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Conflict Action Window');

                this.player2.player.getDynastyCardsInProvince('province 2').forEach((card) => {
                    card.facedown = true;
                });
                this.player2.pass();
                this.player1.clickCard(this.delicacy);
                this.player1.clickCard(this.oguri);
                expect(this.delicacy.location).toBe('conflict discard pile');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.oguri);
                this.player2.clickCard(this.oguri);
                expect(this.oguri.militarySkill).toBe(2);
                expect(this.oguri.politicalSkill).toBe(3);
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
