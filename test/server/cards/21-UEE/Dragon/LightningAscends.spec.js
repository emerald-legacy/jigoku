describe('Lightning Ascends', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['itinerant-philosopher', 'agasha-sumiko'],
                    hand: ['lightning-ascends']
                },
                player2: {
                    inPlay: ['solemn-scholar']
                }
            });
            this.itinerantPhilosopher = this.player1.findCardByName('itinerant-philosopher');
            this.agashaSumiko = this.player1.findCardByName('agasha-sumiko');
            this.solemnScholar = this.player2.findCardByName('solemn-scholar');
            this.lightningAscends = this.player1.findCardByName('lightning-ascends');
            this.noMoreActions();
        });

        it('only works on participating characters', function () {
            this.initiateConflict({
                type: 'military',
                attackers: [this.itinerantPhilosopher],
                defenders: [this.solemnScholar]
            });
            this.player2.pass();
            this.player1.clickCard(this.lightningAscends);
            expect(this.player1).toHavePrompt('Lightning Ascends');
            expect(this.player1).toBeAbleToSelect(this.itinerantPhilosopher);
            expect(this.player1).not.toBeAbleToSelect(this.agashaSumiko);
            expect(this.player1).not.toBeAbleToSelect(this.solemnScholar);

            this.player1.clickCard(this.itinerantPhilosopher);
            expect(this.player1).toHavePrompt('Choose a character to lose all traits');
            expect(this.player1).not.toBeAbleToSelect(this.agashaSumiko);
            expect(this.player1).not.toBeAbleToSelect(this.itinerantPhilosopher);
            expect(this.player1).toBeAbleToSelect(this.solemnScholar);
        });

        it('gives +2/+0 and removes traits from opponent', function () {
            this.initiateConflict({
                type: 'military',
                attackers: [this.itinerantPhilosopher, this.agashaSumiko],
                defenders: [this.solemnScholar]
            });
            this.player2.pass();
            const currentMilitarySkill = this.itinerantPhilosopher.militarySkill;
            const currentPoliticalSkill = this.itinerantPhilosopher.politicalSkill;

            this.player1.clickCard(this.lightningAscends);
            this.player1.clickCard(this.itinerantPhilosopher);
            this.player1.clickCard(this.solemnScholar);

            expect(this.itinerantPhilosopher.militarySkill).toBe(currentMilitarySkill + 2);
            expect(this.itinerantPhilosopher.politicalSkill).toBe(currentPoliticalSkill);

            expect(this.solemnScholar.getTraits().size).toBe(0);

            expect(this.getChatLogs(3)).toContain(
                'player1 plays Lightning Ascends to grant +2 military to Itinerant Philosopher and remove all traits from Solemn Scholar'
            );
        });
    });
});

describe('Lightning Ascends on a character with a gained trait', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['itinerant-philosopher'],
                    hand: ['lightning-ascends']
                },
                player2: {
                    inPlay: ['solemn-scholar', 'kakita-mio']
                }
            });
            this.philosopher = this.player1.findCardByName('itinerant-philosopher');
            this.lightningAscends = this.player1.findCardByName('lightning-ascends');
            this.scholar = this.player2.findCardByName('solemn-scholar');
            this.mio = this.player2.findCardByName('kakita-mio');

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.philosopher],
                defenders: [this.scholar]
            });
            this.player2.clickCard(this.mio);
            this.player2.clickCard(this.scholar);
            expect(this.scholar.hasTrait('shadowlands')).toBe(true);
        });

        it('should remove the gained trait too', function () {
            this.player1.clickCard(this.lightningAscends);
            this.player1.clickCard(this.philosopher);
            this.player1.clickCard(this.scholar);
            expect(this.lightningAscends.location).toBe('conflict discard pile');
            expect(this.scholar.hasTrait('scholar')).toBe(false);
            expect(this.scholar.hasTrait('shadowlands')).toBe(false);
            expect(this.scholar.getTraits().size).toBe(0);
        });
    });
});

describe('Lightning Ascends with characters on the other side than their controller', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['itinerant-philosopher', 'endless-plains-skirmisher'],
                    hand: ['lightning-ascends', 'seal-of-the-dragon']
                },
                player2: {
                    inPlay: ['solemn-scholar', 'endless-plains-skirmisher'],
                    hand: ['seal-of-the-dragon']
                }
            });
            this.philosopher = this.player1.findCardByName('itinerant-philosopher');
            this.skirmisher1 = this.player1.findCardByName('endless-plains-skirmisher');
            this.lightningAscends = this.player1.findCardByName('lightning-ascends');
            this.scholar = this.player2.findCardByName('solemn-scholar');
            this.skirmisher2 = this.player2.findCardByName('endless-plains-skirmisher');

            this.player1.playAttachment(this.player1.findCardByName('seal-of-the-dragon'), this.skirmisher1);
            this.player2.playAttachment(this.player2.findCardByName('seal-of-the-dragon'), this.skirmisher2);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.philosopher],
                defenders: [this.scholar]
            });
            this.player2.clickCard(this.skirmisher2);
            this.player2.clickPrompt('player1');
            this.player1.clickCard(this.skirmisher1);
            this.player1.clickPrompt('player2');
            this.player2.pass();
        });

        it('chooses a Monk on your side and a character on the enemy side, whoever controls them', function () {
            expect(this.game.currentConflict.attackers).toContain(this.skirmisher2);
            expect(this.game.currentConflict.defenders).toContain(this.skirmisher1);

            this.player1.clickCard(this.lightningAscends);
            expect(this.player1).toBeAbleToSelect(this.philosopher);
            expect(this.player1).toBeAbleToSelect(this.skirmisher2);
            expect(this.player1).not.toBeAbleToSelect(this.skirmisher1);
            this.player1.clickCard(this.skirmisher2);

            expect(this.player1).toBeAbleToSelect(this.scholar);
            expect(this.player1).toBeAbleToSelect(this.skirmisher1);
            expect(this.player1).not.toBeAbleToSelect(this.philosopher);
            this.player1.clickCard(this.skirmisher1);

            expect(this.skirmisher2.militarySkill).toBe(5);
            expect(this.skirmisher1.hasTrait('cavalry')).toBe(false);
            expect(this.getChatLogs(3)).toContain('player1 plays Lightning Ascends to grant +2 military to Endless Plains Skirmisher and remove all traits from Endless Plains Skirmisher');
        });
    });
});
