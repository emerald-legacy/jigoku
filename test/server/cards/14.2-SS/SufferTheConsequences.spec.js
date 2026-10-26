describe('Suffer the Consequences', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['soshi-aoi', 'palace-guard', 'bayushi-liar', 'keeper-initiate'],
                    hand: ['suffer-the-consequences', 'a-new-name']
                },
                player2: {
                    inPlay: ['matsu-berserker']
                }
            });

            this.shugenja = this.player1.findCardByName('soshi-aoi');
            this.bushi = this.player1.findCardByName('palace-guard');
            this.courtier = this.player1.findCardByName('bayushi-liar');
            this.monk = this.player1.findCardByName('keeper-initiate');
            this.suffer = this.player1.findCardByName('suffer-the-consequences');

            this.bushiP2 = this.player2.findCardByName('matsu-berserker');
        });

        it('should only allow you to pay with bowed characters', function() {
            this.monk.bowed = true;
            this.bushi.bowed = true;

            this.player1.clickCard(this.suffer);

            expect(this.player1).toBeAbleToSelect(this.bushi);
            expect(this.player1).not.toBeAbleToSelect(this.shugenja);
            expect(this.player1).not.toBeAbleToSelect(this.monk);
            expect(this.player1).not.toBeAbleToSelect(this.courtier);
        });

        it('should only count shugenja, courtier or bushi characters', function() {
            this.monk.bowed = true;
            this.bushi.bowed = true;
            this.courtier.bowed = true;
            this.shugenja.bowed = true;

            this.player1.clickCard(this.suffer);

            expect(this.player1).toBeAbleToSelect(this.bushi);
            expect(this.player1).toBeAbleToSelect(this.shugenja);
            expect(this.player1).not.toBeAbleToSelect(this.monk);
            expect(this.player1).toBeAbleToSelect(this.courtier);
        });

        it('should count a gained trait', function() {
            this.newName = this.player1.playAttachment('a-new-name', this.monk);
            this.monk.bowed = true;

            this.player2.pass();
            this.player1.clickCard(this.suffer);

            expect(this.player1).toBeAbleToSelect(this.monk);
        });

        it('should grant you an additional political conflict', function() {
            this.monk.bowed = true;
            this.bushi.bowed = true;
            this.courtier.bowed = true;
            this.shugenja.bowed = true;

            this.player1.clickCard(this.suffer);
            this.player1.clickCard(this.bushi);

            expect(this.bushi.location).toBe('dynasty discard pile');
            expect(this.player1.player.getRemainingConflictOpportunitiesForType('political')).toBe(2);
        });
    });
});

describe('Suffer the Consequences under Waning Hostilities', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'draw',
                player1: {
                    inPlay: [{ card: 'matsu-berserker', bowed: true }],
                    hand: ['waning-hostilities', 'suffer-the-consequences']
                }
            });
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.waning = this.player1.findCardByName('waning-hostilities');
            this.suffer = this.player1.findCardByName('suffer-the-consequences');
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            this.noMoreActions();
            this.player1.clickCard(this.waning);
        });

        // an additional conflict would change nothing (RRG playing cards, ruling #372)
        it('should not be playable when no further conflict can be declared', function() {
            expect(this.waning.location).toBe('conflict discard pile');
            expect(this.player1).toHavePrompt('Initiate an action');
            this.player1.clickCard(this.suffer);
            expect(this.player1).toHavePrompt('Initiate an action');
            expect(this.berserker.location).toBe('play area');
            expect(this.suffer.location).toBe('hand');
        });
    });
});
