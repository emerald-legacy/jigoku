describe('Shinjo Trailblazer', function() {
    integration(function() {
        describe('Shinjo Trailblazer\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-trailblazer']
                    },
                    player2: {
                    }
                });

                this.shinjoTrailblazer = this.player1.findCardByName('shinjo-trailblazer');

                this.noMoreActions();
            });

            it('should trigger when a province is revealed', function() {
                this.player1.declareConflict('military', null, [this.shinjoTrailblazer], 'air');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.shinjoTrailblazer);
            });

            it('should give +2/+2', function() {
                const militarySkill = this.shinjoTrailblazer.militarySkill;
                const politicalSkill = this.shinjoTrailblazer.politicalSkill;
                this.player1.declareConflict('military', null, [this.shinjoTrailblazer], 'air');
                this.player1.clickCard(this.shinjoTrailblazer);
                expect(this.shinjoTrailblazer.militarySkill).toBe(militarySkill + 2);
                expect(this.shinjoTrailblazer.politicalSkill).toBe(politicalSkill + 2);
            });

            it('should expire at the end of the conflict', function() {
                const militarySkill = this.shinjoTrailblazer.militarySkill;
                const politicalSkill = this.shinjoTrailblazer.politicalSkill;
                this.player1.declareConflict('military', null, [this.shinjoTrailblazer], 'air');
                this.player1.clickCard(this.shinjoTrailblazer);
                expect(this.shinjoTrailblazer.militarySkill).toBe(militarySkill + 2);
                expect(this.shinjoTrailblazer.politicalSkill).toBe(politicalSkill + 2);
                this.player2.assignDefenders([]);
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.shinjoTrailblazer.militarySkill).toBe(militarySkill);
                expect(this.shinjoTrailblazer.politicalSkill).toBe(politicalSkill);
            });
        });

        describe('Shinjo Trailblazer\'s ability and other reveals', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-trailblazer']
                    },
                    player2: {
                        inPlay: ['matsu-berserker']
                    }
                });
                this.shinjoTrailblazer = this.player1.findCardByName('shinjo-trailblazer');
                this.ownProvince = this.player1.findCardByName('shameful-display', 'province 2');
                this.oppProvince = this.player2.findCardByName('shameful-display', 'province 2');
                this.berserker = this.player2.findCardByName('matsu-berserker');
            });

            it('does not trigger when your own province is revealed during a conflict', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                expect(this.ownProvince.facedown).toBe(true);
                this.player2.declareConflict('military', this.ownProvince, [this.berserker], 'air');
                expect(this.ownProvince.facedown).toBe(false);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Choose defenders');
                expect(this.shinjoTrailblazer.militarySkill).toBe(2);
                expect(this.shinjoTrailblazer.politicalSkill).toBe(1);
            });
        });

        describe('Shinjo Trailblazer\'s ability outside a conflict', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        fate: 10,
                        inPlay: ['shinjo-trailblazer'],
                        dynastyDiscard: ['iuchi-farseer']
                    }
                });
                this.shinjoTrailblazer = this.player1.findCardByName('shinjo-trailblazer');
                this.iuchiFarseer = this.player1.placeCardInProvince('iuchi-farseer', 'province 1');
                this.oppProvince = this.player2.findCardByName('shameful-display', 'province 2');
            });

            it('does not trigger when an opponent\'s province is revealed outside a conflict', function() {
                this.player1.clickCard(this.iuchiFarseer);
                this.player1.clickPrompt('0');
                expect(this.iuchiFarseer.location).toBe('play area');
                this.player1.clickCard(this.iuchiFarseer);
                this.player1.clickCard(this.oppProvince);
                expect(this.oppProvince.facedown).toBe(false);
                expect(this.game.isDuringConflict()).toBe(false);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Play cards from provinces');
                expect(this.shinjoTrailblazer.militarySkill).toBe(2);
                expect(this.shinjoTrailblazer.politicalSkill).toBe(1);
            });
        });
    });
});

