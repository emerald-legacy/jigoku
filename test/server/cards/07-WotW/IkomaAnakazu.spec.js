describe('Ikoma Anakazu', function() {
    integration(function() {
        describe('Ikoma Anakuza\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ikoma-anakazu', 'akodo-toturi']
                    },
                    player2: {
                        inPlay: ['doji-hotaru']
                    }
                });
                this.ikomaAnakazu = this.player1.findCardByName('ikoma-anakazu');
                this.akodoToturi = this.player1.findCardByName('akodo-toturi');

                this.dojiHotaru = this.player2.findCardByName('doji-hotaru');
            });

            it('should have no effect if no provinces have been broken this phase', function() {
                expect(this.ikomaAnakazu.militarySkill).toBe(3);
                expect(this.ikomaAnakazu.politicalSkill).toBe(3);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ikomaAnakazu],
                    defenders: []
                });
                expect(this.ikomaAnakazu.militarySkill).toBe(3);
                expect(this.ikomaAnakazu.politicalSkill).toBe(3);
            });

            it('should have no effect if your opponent has not broken a province this phase', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoToturi],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                this.player1.clickPrompt('Pass');
                expect(this.player1).toHavePrompt('Action Window');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiHotaru],
                    defenders: [this.ikomaAnakazu],
                    ring: 'earth'
                });
                expect(this.ikomaAnakazu.isParticipating()).toBe(true);
                expect(this.ikomaAnakazu.militarySkill).toBe(3);
                expect(this.ikomaAnakazu.politicalSkill).toBe(3);
            });

            it('should give +3/+3 if your opponent has broken a province this phase and Ikoma Anakazu is participating', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiHotaru],
                    defenders: [],
                    type: 'political'
                });
                this.noMoreActions();
                this.player2.clickPrompt('No');
                this.player2.clickPrompt('Don\'t Resolve');
                this.player2.clickPrompt('Pass');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoToturi, this.ikomaAnakazu],
                    defenders: [],
                    ring: 'earth'
                });
                expect(this.ikomaAnakazu.isParticipating()).toBe(true);
                expect(this.ikomaAnakazu.militarySkill).toBe(6);
                expect(this.ikomaAnakazu.politicalSkill).toBe(6);
            });
        });
    });
});

describe('Ikoma Anakazu - own province broken outside conflict resolution', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ikoma-anakazu', 'akodo-toturi'],
                    hand: ['raze-to-the-ground'],
                    provinces: ['manicured-garden']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu'],
                    provinces: ['entrenched-position']
                }
            });
            this.ikomaAnakazu = this.player1.findCardByName('ikoma-anakazu');
            this.toturi = this.player1.findCardByName('akodo-toturi');
            this.garden = this.player1.findCardByName('manicured-garden');
            this.garden.facedown = false;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.player2.findCardByName('entrenched-position'),
                attackers: [this.ikomaAnakazu, this.toturi],
                defenders: ['mirumoto-raitsugu']
            });
        });

        // ruling #634: the opponent is considered to have broken a province broken outside standard conflict resolution
        it('should give +3/+3 after Raze to the Ground breaks one of your provinces', function() {
            expect(this.ikomaAnakazu.militarySkill).toBe(3);
            this.noMoreActions();
            this.player1.clickCard('raze-to-the-ground');
            this.player1.clickCard(this.toturi);
            this.player1.clickCard(this.garden);
            expect(this.player2).toHavePrompt('Break Manicured Garden');
            this.player2.clickPrompt('No');
            this.player1.clickPrompt('No');
            expect(this.garden.isBroken).toBe(true);
            expect(this.ikomaAnakazu.isParticipating()).toBe(true);
            expect(this.ikomaAnakazu.militarySkill).toBe(6);
            expect(this.ikomaAnakazu.politicalSkill).toBe(6);
        });
    });
});
