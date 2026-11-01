describe('Kabuki Hero', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 3,
                    inPlay: ['kabuki-hero']
                },
                player2: {
                    inPlay: ['matsu-berserker']
                }
            });
            this.kabukiHero = this.player1.findCardByName('kabuki-hero');
        });

        it('should spend 1 fate to give itself +X military equal to its political skill', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kabukiHero],
                defenders: []
            });
            this.player2.pass();
            expect(this.kabukiHero.militarySkill).toBe(0);
            this.player1.clickCard(this.kabukiHero);
            expect(this.kabukiHero.militarySkill).toBe(2);
            expect(this.kabukiHero.politicalSkill).toBe(2);
            expect(this.player1.fate).toBe(2);
            expect(this.getChatLogs(3)).toContain('player1 uses Kabuki Hero, spending 1 fate to give itself +2military/+0political until the end of the conflict');
        });

        it('should not be usable without fate', function() {
            this.player1.fate = 0;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kabukiHero],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.kabukiHero);
            expect(this.kabukiHero.militarySkill).toBe(0);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should not be usable outside a conflict', function() {
            this.player1.clickCard(this.kabukiHero);
            expect(this.kabukiHero.militarySkill).toBe(0);
            expect(this.player1.fate).toBe(3);
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});

describe('Kabuki Hero at 0 political skill', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 3,
                    inPlay: ['kabuki-hero']
                },
                player2: {
                    inPlay: ['sinister-soshi']
                }
            });
            this.kabukiHero = this.player1.findCardByName('kabuki-hero');
            this.soshi = this.player2.findCardByName('sinister-soshi');
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.kabukiHero],
                defenders: []
            });
            this.player2.clickCard(this.soshi);
            this.player2.clickCard(this.kabukiHero);
        });

        it('should not be usable, as +0 changes nothing', function() {
            expect(this.kabukiHero.politicalSkill).toBe(0);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.kabukiHero);
            expect(this.player1.fate).toBe(3);
            expect(this.kabukiHero.militarySkill).toBe(0);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
