<template>
  <div class="team-intro">
    <h2 class="title">팀 소개</h2>
    <div class="team-list">
      <div v-for="(member, index) in teamMembers" :key="index" class="team-member">
        <img :src="member.photo" :alt="`${member.name} 사진`" class="member-photo" />
        <h3 class="member-name">{{ member.name }}</h3>
        <p class="member-role">{{ member.role }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const teamMembers = [
  { name: '김철수', photo: 'photo1.jpg', role: '팀장' },
  { name: '이영희', photo: 'photo2.jpg', role: '개발자' },
  { name: '박민수', photo: 'photo3.jpg', role: '디자이너' },
  { name: '장혜진', photo: 'photo4.jpg', role: '기획자' },
  { name: '최현우', photo: 'photo5.jpg', role: 'QA' }
]
</script>

<style scoped>
.team-intro {
  text-align: center;
  margin: 2rem 0;
}

.team-list {
}

.team-member {
  display: inline-block;
  width: 33%; /* 3명의 팀원이 한 줄에 들어가도록 */
  text-align: center;
  margin: 1rem;
  padding: 2rem;
  border: 3px solid #eee;
}

.member-photo {
  display: inline-block;
  width: 150px;
  height: 150px;
  background-color: #eee;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.member-name {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.member-role {
  font-size: 1rem;
  color: #666;
}
</style>
