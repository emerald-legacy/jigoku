describe('The Maidens Icy Grasp', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['miya-mystic'],
                    hand: ['the-maiden-s-icy-grasp','village-doshin']
                },
                player2: {
                    honor: 11,
                    inPlay: ['daidoji-uji', 'kitsu-spiritcaller','shiba-ryuu'],
                    hand: ['tattooed-wanderer', 'shosuro-miyako-2','one-with-the-sea','the-maiden-s-icy-grasp'],
                    dynastyDiscard: ['doji-challenger']
                }
            });
            this.grasp = this.player1.findCardByName('the-maiden-s-icy-grasp');
            this.mystic = this.player1.findCardByName('miya-mystic');
            this.villageDoshin = this.player1.findCardByName('village-doshin');

            this.miyako = this.player2.findCardByName('shosuro-miyako-2');
            this.uji = this.player2.findCardByName('daidoji-uji');
            this.uji.honor();
            this.spiritcaller = this.player2.findCardByName('kitsu-spiritcaller');
            this.wanderer = this.player2.findCardByName('tattooed-wanderer');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.ryuu = this.player2.findCardByName('shiba-ryuu');
            this.oneWithTheSea = this.player2.findCardByName('one-with-the-sea');
            this.grasp2 = this.player2.findCardByName('the-maiden-s-icy-grasp');

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.mystic],
                defenders: [this.uji, this.spiritcaller]
            });
        });

        describe('base cases',function () {


            it('character from hand', function () {
                this.player2.clickCard(this.wanderer);
                this.player2.clickPrompt('Play this character');
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Conflict');

                this.player1.clickCard(this.grasp);
                expect(this.player1).toHavePrompt('Choose a character');
                this.player1.clickCard(this.wanderer);
                expect(this.getChatLogs(5)).toContain(
                    'player1 plays The Maiden\'s Icy Grasp to prevent Tattooed Wanderer from contributing to resolution of this conflict'
                );
                expect(this.getChatLogs(2)).toContain('Military Air conflict - Attacker: 1 Defender: 9');
            });

            it('disguised character from hand', function () {
                this.player2.clickCard(this.miyako);
                this.player2.clickCard(this.spiritcaller);
                this.player2.clickPrompt('Conflict');
                this.player2.clickPrompt('Pass');

                this.player1.clickCard(this.grasp);
                expect(this.player1).toHavePrompt('Choose a character');
                this.player1.clickCard(this.miyako);
                expect(this.getChatLogs(5)).toContain(
                    'player1 plays The Maiden\'s Icy Grasp to prevent Shosuro Miyako from contributing to resolution of this conflict'
                );
                expect(this.getChatLogs(2)).toContain('Military Air conflict - Attacker: 1 Defender: 8');
            });

            it('spiritcaller', function () {
                this.player2.clickCard(this.spiritcaller);
                this.player2.clickCard(this.challenger);

                this.player1.clickCard(this.grasp);
                expect(this.player1).toHavePrompt('Choose a character');
                this.player1.clickCard(this.challenger);
                expect(this.getChatLogs(5)).toContain(
                    'player1 plays The Maiden\'s Icy Grasp to prevent Doji Challenger from contributing to resolution of this conflict'
                );
                expect(this.getChatLogs(2)).toContain('Military Air conflict - Attacker: 1 Defender: 8');
            });

            it('also works when conflict has alternative', function () {
                this.player2.clickCard(this.oneWithTheSea);
                this.player2.clickCard(this.ryuu);

                this.player1.clickCard(this.villageDoshin);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');

                this.player2.clickCard(this.grasp2);
                expect(this.player2).toHavePrompt('Choose a character');
                this.player2.clickCard(this.villageDoshin);
                expect(this.getChatLogs(5)).toContain(
                    'player2 plays The Maiden\'s Icy Grasp to prevent Village Dōshin from contributing to resolution of this conflict'
                );
                expect(this.getChatLogs(10)).toContain(`Military Air conflict - Attacker: ${
                    this.mystic.getMilitarySkill()
            + this.mystic.getPoliticalSkill()
                } Defender: ${
                    this.uji.getMilitarySkill()
            + this.uji.getPoliticalSkill()
            + this.spiritcaller.getMilitarySkill()
            + this.spiritcaller.getPoliticalSkill()
            + this.ryuu.getMilitarySkill()
            + this.ryuu.getPoliticalSkill()
                }`);

                this.noMoreActions();
                expect(this.getChatLogs(2)).toContain('player2 won a military conflict 21 vs 2');
            });
        });
    });
});
